variable "vercel_api_token" {
  type      = string
  sensitive = true
}

variable "vercel_team_id" {
  type    = string
  default = null
}

variable "project_name" {
  type    = string
  default = "just-nil"
}

variable "domain" {
  type    = string
  default = ""
}

variable "environment_variables" {
  type    = map(string)
  default = {}
}
