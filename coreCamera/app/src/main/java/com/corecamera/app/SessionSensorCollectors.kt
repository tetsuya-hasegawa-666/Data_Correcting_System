package com.corecamera.app

import android.Manifest
import android.annotation.SuppressLint
import android.bluetooth.BluetoothManager
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanResult
import android.content.Context
import android.content.pm.PackageManager
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Build
import android.os.Bundle
import android.os.Looper
import android.os.SystemClock
import androidx.core.content.ContextCompat
import java.io.BufferedWriter
import java.io.FileWriter
import java.util.Locale

class SessionSensorCollectors(
    private val context: Context,
    private val artifactStore: SessionArtifactStore,
    private val onCollectorStatusChanged: (collector: String, status: String) -> Unit,
) {
    private val sensorManager = context.getSystemService(SensorManager::class.java)
    private val locationManager = context.getSystemService(LocationManager::class.java)
    private val bluetoothManager = context.getSystemService(BluetoothManager::class.java)

    private val imuCollector = ImuCollector()
    private val gnssCollector = GnssCollector()
    private val bleCollector = BleCollector()

    fun start(artifacts: SessionArtifacts) {
        imuCollector.start(artifacts)
        gnssCollector.start(artifacts)
        bleCollector.start(artifacts)
    }

    fun stop() {
        imuCollector.stop()
        gnssCollector.stop()
        bleCollector.stop()
    }

    private inner class ImuCollector : SensorEventListener {
        private var artifacts: SessionArtifacts? = null
        private var writer: BufferedWriter? = null
        private val lastLoggedByType = mutableMapOf<Int, Long>()
        private val logIntervalNs = 20_000_000L

        fun start(sessionArtifacts: SessionArtifacts) {
            artifacts = sessionArtifacts
            writer = FileWriter(sessionArtifacts.imuFile, true).buffered()
            lastLoggedByType.clear()
            val sensors = listOf(
                sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER),
                sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE),
            ).filterNotNull()
            if (sensors.isEmpty()) {
                onCollectorStatusChanged("imu", "sensor_unavailable")
                return
            }
            sensors.forEach { sensor ->
                sensorManager.registerListener(this, sensor, SensorManager.SENSOR_DELAY_GAME)
            }
            onCollectorStatusChanged("imu", "active")
        }

        fun stop() {
            sensorManager.unregisterListener(this)
            runCatching { writer?.flush() }
            runCatching { writer?.close() }
            if (artifacts != null) {
                onCollectorStatusChanged("imu", "stopped")
            }
            writer = null
            artifacts = null
            lastLoggedByType.clear()
        }

        override fun onSensorChanged(event: SensorEvent) {
            val activeArtifacts = artifacts ?: return
            val activeWriter = writer ?: return
            val nowNs = SystemClock.elapsedRealtimeNanos()
            val lastLoggedNs = lastLoggedByType[event.sensor.type] ?: 0L
            if (nowNs - lastLoggedNs < logIntervalNs) {
                return
            }
            lastLoggedByType[event.sensor.type] = nowNs
            artifactStore.appendImuSample(
                artifacts = activeArtifacts,
                sensorType = event.sensor.stringType,
                eventTimestampNs = event.timestamp,
                elapsedRealtimeNs = nowNs,
                wallTimeMs = System.currentTimeMillis(),
                x = event.values.getOrNull(0) ?: 0f,
                y = event.values.getOrNull(1) ?: 0f,
                z = event.values.getOrNull(2) ?: 0f,
                accuracy = event.accuracy,
                writer = activeWriter,
            )
        }

        override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) = Unit
    }

    private inner class GnssCollector : LocationListener {
        private var artifacts: SessionArtifacts? = null
        private var writer: BufferedWriter? = null
        private var registeredProviders: List<String> = emptyList()

        @SuppressLint("MissingPermission")
        fun start(sessionArtifacts: SessionArtifacts) {
            artifacts = sessionArtifacts
            if (!hasPermission(Manifest.permission.ACCESS_FINE_LOCATION)) {
                onCollectorStatusChanged("gnss", "permission_denied")
                return
            }
            writer = FileWriter(sessionArtifacts.gnssFile, true).buffered()
            val providers = buildList {
                if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                    add(LocationManager.GPS_PROVIDER)
                }
                if (locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                    add(LocationManager.NETWORK_PROVIDER)
                }
            }
            if (providers.isEmpty()) {
                onCollectorStatusChanged("gnss", "provider_disabled")
                return
            }
            registeredProviders = providers
            providers.forEach { provider ->
                locationManager.requestLocationUpdates(provider, 1000L, 0f, this, Looper.getMainLooper())
            }
            onCollectorStatusChanged("gnss", "active")
        }

        fun stop() {
            if (registeredProviders.isNotEmpty()) {
                runCatching { locationManager.removeUpdates(this) }
            }
            runCatching { writer?.flush() }
            runCatching { writer?.close() }
            if (artifacts != null) {
                onCollectorStatusChanged("gnss", "stopped")
            }
            writer = null
            artifacts = null
            registeredProviders = emptyList()
        }

        override fun onLocationChanged(location: Location) {
            val activeArtifacts = artifacts ?: return
            val activeWriter = writer ?: return
            artifactStore.appendGnssSample(
                artifacts = activeArtifacts,
                provider = location.provider ?: "unknown",
                elapsedRealtimeNs = SystemClock.elapsedRealtimeNanos(),
                wallTimeMs = System.currentTimeMillis(),
                latitude = location.latitude,
                longitude = location.longitude,
                altitude = location.altitude,
                accuracyMeters = location.accuracy,
                speedMetersPerSecond = location.speed,
                bearingDegrees = location.bearing,
                verticalAccuracyMeters = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    location.verticalAccuracyMeters
                } else {
                    null
                },
                writer = activeWriter,
            )
        }

        override fun onProviderEnabled(provider: String) = Unit

        override fun onProviderDisabled(provider: String) = Unit

        @Deprecated("Deprecated in Java")
        override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) = Unit
    }

    private inner class BleCollector {
        private var artifacts: SessionArtifacts? = null
        private var writer: BufferedWriter? = null
        private var callback: ScanCallback? = null

        @SuppressLint("MissingPermission")
        fun start(sessionArtifacts: SessionArtifacts) {
            artifacts = sessionArtifacts
            if (!hasBleScanPermission()) {
                onCollectorStatusChanged("ble", "permission_denied")
                return
            }
            val adapter = bluetoothManager.adapter
            if (adapter == null) {
                onCollectorStatusChanged("ble", "bluetooth_unavailable")
                return
            }
            if (!adapter.isEnabled) {
                onCollectorStatusChanged("ble", "bluetooth_disabled")
                return
            }
            val scanner = adapter.bluetoothLeScanner
            if (scanner == null) {
                onCollectorStatusChanged("ble", "scanner_unavailable")
                return
            }
            writer = FileWriter(sessionArtifacts.bleFile, true).buffered()
            callback = object : ScanCallback() {
                override fun onScanResult(callbackType: Int, result: ScanResult) {
                    appendBleResult(callbackType.toString(), result, null)
                }

                override fun onBatchScanResults(results: MutableList<ScanResult>) {
                    results.forEach { result -> appendBleResult("batch", result, null) }
                }

                override fun onScanFailed(errorCode: Int) {
                    onCollectorStatusChanged("ble", "scan_failed_$errorCode")
                    appendBleResult("scan_failed", null, errorCode)
                }
            }
            scanner.startScan(callback)
            onCollectorStatusChanged("ble", "active")
        }

        @SuppressLint("MissingPermission")
        fun stop() {
            val adapter = bluetoothManager.adapter
            val scanner = adapter?.bluetoothLeScanner
            callback?.let { activeCallback ->
                runCatching { scanner?.stopScan(activeCallback) }
            }
            runCatching { writer?.flush() }
            runCatching { writer?.close() }
            if (artifacts != null) {
                onCollectorStatusChanged("ble", "stopped")
            }
            callback = null
            writer = null
            artifacts = null
        }

        private fun appendBleResult(callbackType: String, result: ScanResult?, errorCode: Int?) {
            val activeArtifacts = artifacts ?: return
            val activeWriter = writer ?: return
            val manufacturerDataHex = result?.scanRecord?.manufacturerSpecificData?.let { sparseArray ->
                buildString {
                    for (index in 0 until sparseArray.size()) {
                        if (isNotEmpty()) append(';')
                        append(sparseArray.keyAt(index))
                        append(':')
                        append(sparseArray.valueAt(index).toHexString())
                    }
                }.ifBlank { null }
            }
            artifactStore.appendBleSample(
                artifacts = activeArtifacts,
                elapsedRealtimeNs = SystemClock.elapsedRealtimeNanos(),
                wallTimeMs = System.currentTimeMillis(),
                callbackType = callbackType,
                address = result?.device?.address,
                rssi = result?.rssi,
                name = result?.scanRecord?.deviceName,
                manufacturerDataHex = manufacturerDataHex,
                errorCode = errorCode,
                writer = activeWriter,
            )
        }
    }

    private fun hasPermission(permission: String): Boolean =
        ContextCompat.checkSelfPermission(context, permission) == PackageManager.PERMISSION_GRANTED

    private fun hasBleScanPermission(): Boolean =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            hasPermission(Manifest.permission.BLUETOOTH_SCAN)
        } else {
            hasPermission(Manifest.permission.ACCESS_FINE_LOCATION)
        }

    private fun ByteArray.toHexString(): String = joinToString(separator = "") { byte ->
        String.format(Locale.US, "%02x", byte)
    }
}
