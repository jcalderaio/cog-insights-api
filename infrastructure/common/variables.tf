variable "lambda_name" {
  default = "esante-insights-api"
}

variable "lambda_description" {
  default = "eSante Insights API"
}

variable "lambda_s3_bucket" {
  default = "cgs-artifacts"
}

variable "lambda_s3_key" {
  default = "esante/insights/esante-insights-api/esante-insights-api.zip"
}

# TODO: load this from remote vpc state
variable "lambda_subnets" {
  type    = "list"
  default = ["subnet-97139bab", "subnet-b9f8ebf0"]
}

variable "lambda_security_groups" {
  type    = "list"
  default = ["sg-39c4c045"]
}

# Must be nodejs6.10 so that it works with Intersystems cachedb driver
variable "lambda_runtime" {
  default = "nodejs6.10"
}
