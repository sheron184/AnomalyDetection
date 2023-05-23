-- view page
INSERT INTO `topology` (`topology_id`, `topology_name`, `topology_parent`, `topology_page`, `topology_order`,
                        `topology_group`, `topology_url`, `topology_url_opt`, `topology_popup`, `topology_modules`,
                        `topology_show`)
VALUES ('', 'Anomaly Detection', 6, 555, 140, 1, './modules/AnomalyDetection/index.php', NULL, '0', '1', '1');
INSERT INTO `topology` (`topology_id`, `topology_name`, `topology_parent`, `topology_page`, `topology_order`,
                        `topology_group`, `topology_url`, `topology_url_opt`, `topology_popup`, `topology_modules`,
                        `topology_show`)
VALUES ('', 'Anomaly Monitoring', 2, 556, 10, 1, './modules/AnomalyDetection/monitoring.php', NULL, '0', '1', '1');

-- Create module table;
CREATE TABLE IF NOT EXISTS anoma_metrics
    (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) DEFAULT NULL,
    `comment` text DEFAULT NULL,
    `host_id` int(11) DEFAULT NULL,
    `host_name` varchar(255) DEFAULT NULL,
    `service_id` int(11) DEFAULT NULL,
    `service_name` varchar(255) DEFAULT NULL,
    `metric_id` int(11) DEFAULT NULL,
    `metric_name` varchar(255) DEFAULT NULL,
    `unit` varchar(50) DEFAULT NULL,
    `notification_status` enum('0','1') NOT NULL DEFAULT '1',
    `contact_id` longtext DEFAULT NULL,
    `contact_group_id` longtext DEFAULT NULL,
    `status` enum('0','1') NOT NULL DEFAULT '1',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=259 DEFAULT CHARSET=utf8