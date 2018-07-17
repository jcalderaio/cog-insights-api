provider "aws" {
  # access_key = "${var.aws_access_key}"
  # secret_key = "${var.aws_secret_key}"
  region = "us-east-1"
}

terraform {
  backend "s3" {
    bucket = "cgs-terraform"
    key    = "esante/insights/esante-insights-api.tfstate"
    region = "us-east-1"
  }
}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {
  current = true
}
