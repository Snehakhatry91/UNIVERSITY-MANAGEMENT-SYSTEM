output "vpc_id" {
  description = "Production VPC Identifier"
  value       = aws_vpc.cvgu_vpc.id
}

output "alb_dns_name" {
  description = "Application Load Balancer Canonical Domain Name"
  value       = aws_lb.campus_alb.dns_name
}

output "rds_endpoint" {
  description = "Private Multi-AZ RDS Endpoint (Accessible inside VPC only)"
  value       = aws_db_instance.postgres_primary.endpoint
}

output "vpn_connection_id" {
  description = "Site-to-Site VPN Connection ID to CVGU Bhubaneswar DC"
  value       = aws_vpn_connection.campus_ipsec_vpn.id
}
