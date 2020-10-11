config = {
    "interfaces": {
        "google.firestore.v1.Firestore": {
            "retry_codes": {
                "idempotent": ["DEADLINE_EXCEEDED", "INTERNAL", "UNAVAILABLE"],
                "aborted_unavailable": ["ABORTED", "UNAVAILABLE"],
                "non_idempotent": [],
                "idempotent2": ["DEADLINE_EXCEEDED", "UNAVAILABLE"],
            },
            "retry_params": {
                "default": {
                    "initial_retry_delay_millis": 100,
                    "retry_delay_multiplier": 1.3,
                    "max_retry_delay_millis": 60000,
                    "initial_rpc_timeout_millis": 60000,
                    "rpc_timeout_multiplier": 1.0,
                    "max_rpc_timeout_millis": 60000,
                    "total_timeout_millis": 600000,
                },
                "streaming": {
                    "initial_retry_delay_millis": 100,
                    "retry_delay_multiplier": 1.3,
                    "max_retry_delay_millis": 60000,
                    "initial_rpc_timeout_millis": 60000,
                    "rpc_timeout_multiplier": 1.0,
                    "max_rpc_timeout_millis": 60000,
                    "total_timeout_millis": 600000,
                },
            },
            "methods": {
                "GetDocument": {
                    "timeout_millis": 60000,
                    "retry_codes_name": "idempotent2",
                    "retry_params_name": "default",
                },
                "ListDocuments": {
                    "timeout_millis": 60000,
                    "retry_codes_name": "idempotent2",
                    "retry_params_name": "default",
                },
                "CreateDocument": {
                    "timeout_millis": 60000,
                    "retry_codes_name": "non_idempotent",
                    "retry_params_name": "default",
                },
                "UpdateDocument": {
                    "timeout_millis": 60000,
                    "retry_codes_name": "non_idempotent",
                    "retry_params_name": "default",
                },
                "DeleteDocument": {
                    "timeout_millis": 60000,
                    "retry_codes_name": "idempotent",
                    "retry_params_name": "default",
                },
                "BatchGetDocuments": {
                    "timeout_millis": 60000,
                    "retry_codes_name": "idempotent",
                    "retry_params_name": "streaming",
                },
                "BatchWrite": {
                    "timeout_millis": 60000,
                    "retry_codes_name": "aborted_unavailable",
                    "retry_params_name": "default",
                },
                "BeginTransaction": {
                    "timeout_millis": 60000,
                    "retry_codes_name": "idempotent",
                    "retry_params_name": "default",
                },
                "Commit": {
                    "timeout_millis": 60000,
                    "retry_codes_name": "non_idempotent",
                    "retry_params_name": "default",
                },
                "Rollback": {
                    "timeout_millis": 60000,
                    "retry_codes_name": "idempotent",
                    "retry_params_name": "default",
                },
                "RunQuery": {
                    "timeout_millis": 60000,
                    "retry_codes_name": "idempotent",
                    "retry_params_name": "streaming",
                },
                "Write": {
                    "timeout_millis": 60000,
                    "retry_codes_name": "non_idempotent",
                    "retry_params_name": "streaming",
                },
                "Listen": {
                    "timeout_millis": 60000,
                    "retry_codes_name": "idempotent",
                    "retry_params_name": "streaming",
                },
                "ListCollectionIds": {
                    "timeout_millis": 60000,
                    "retry_codes_name": "idempotent",
                    "retry_params_name": "default",
                },
                "PartitionQuery": {
                    "timeout_millis": 60000,
                    "retry_codes_name": "non_idempotent",
                    "retry_params_name": "default",
                },
            },
        }
    }
}