from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from session_parser import SessionParser


class SessionParserAdditiveFieldTest(unittest.TestCase):
    def test_additive_manifest_fields_do_not_break_parser(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            session_dir = Path(temp_dir) / "session-20260315-guarded"
            session_dir.mkdir(parents=True)

            manifest = {
                "sessionId": "session-20260315-guarded",
                "status": "stopped",
                "deviceModel": "Xperia 5 III",
                "timebase": {
                    "sessionStartWallTimeMs": 1000,
                    "sessionStartElapsedRealtimeNanos": 2000,
                },
                "collectorStatus": {"camera": "active"},
                "sessionAdapter": {
                    "adapterSeamId": "shared-camera-session-adapter",
                    "requestedRoute": "corecamera_shared_camera_trial",
                    "activeRoute": "frozen_camerax_arcore",
                    "cutoverGateStatus": "HOLD_FROZEN_ROUTE",
                },
                "guardedUpstreamTrial": {
                    "status": "PREPARED",
                    "requestedRoute": "corecamera_shared_camera_trial",
                    "activeRoute": "frozen_camerax_arcore",
                    "cutoverGateStatus": "HOLD_FROZEN_ROUTE",
                    "upstreamTrialPackageStatus": "READY",
                },
            }
            (session_dir / "session_manifest.json").write_text(json.dumps(manifest), encoding="utf-8")
            (session_dir / "video_frame_timestamps.csv").write_text(
                "camera_sensor_timestamp_ns,elapsed_realtime_ns,wall_time_ms,rotation_degrees,session_elapsed_ns\n1,2001,1001,0,1\n",
                encoding="utf-8",
            )
            (session_dir / "imu.csv").write_text(
                "sensor_type,event_timestamp_ns,elapsed_realtime_ns,wall_time_ms,x,y,z,accuracy\naccel,2002,2002,1002,0,0,0,3\n",
                encoding="utf-8",
            )
            (session_dir / "gnss.csv").write_text(
                "provider,elapsed_realtime_ns,wall_time_ms,latitude,longitude,altitude,accuracy_m,speed_mps,bearing_deg,vertical_accuracy_m\ngps,2003,1003,0,0,0,1,0,0,1\n",
                encoding="utf-8",
            )
            (session_dir / "ble_scan.jsonl").write_text('{"elapsedRealtimeNanos":2004}\n', encoding="utf-8")
            (session_dir / "arcore_pose.jsonl").write_text('{"elapsedRealtimeNanos":2005}\n', encoding="utf-8")

            parser = SessionParser(session_dir)
            summary = parser.load_summary()
            join_report = parser.build_join_report()

            self.assertEqual("session-20260315-guarded", summary.session_id)
            self.assertEqual(1, summary.stream_counts["frames"])
            self.assertTrue(join_report["metadataSufficiency"]["hasCollectorStatus"])


if __name__ == "__main__":
    unittest.main()
