# ==============================================================================
# HYBRID CLOUD CONNECTIVITY: SITE-TO-SITE IPSEC VPN
# Connects AWS Cloud VPC (10.0.0.0/16) to CVGU Campus Data Center (172.16.0.0/16)
# ==============================================================================

resource "aws_vpn_gateway" "vgw" {
  vpc_id = aws_vpc.cvgu_vpc.id

  tags = {
    Name = "cvgu-virtual-private-gateway"
  }
}

resource "aws_customer_gateway" "campus_cgw" {
  bgp_asn    = 65000
  ip_address = var.campus_cgw_ip
  type       = "ipsec.1"

  tags = {
    Name = "cvgu-bhubaneswar-campus-cgw"
  }
}

resource "aws_vpn_connection" "campus_ipsec_vpn" {
  vpn_gateway_id      = aws_vpn_gateway.vgw.id
  customer_gateway_id = aws_customer_gateway.campus_cgw.id
  type                = "ipsec.1"
  static_routes_only  = false

  tunnel1_inside_cidr = "169.254.10.0/30"
  tunnel2_inside_cidr = "169.254.11.0/30"

  tags = {
    Name = "cvgu-campus-site-to-site-vpn"
  }
}

resource "aws_vpn_gateway_route_propagation" "app_route_propagation" {
  vpn_gateway_id = aws_vpn_gateway.vgw.id
  route_table_id = aws_route_table.private_app_rt.id
}
