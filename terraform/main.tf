resource "vercel_project" "app" {
  name      = var.project_name
  framework = "nextjs"
}

resource "vercel_project_domain" "custom" {
  count      = var.domain != "" ? 1 : 0
  project_id = vercel_project.app.id
  domain     = var.domain
}

resource "vercel_project_environment_variable" "env" {
  for_each = var.environment_variables

  project_id = vercel_project.app.id
  key        = each.key
  value      = each.value
  target     = ["preview", "production", "development"]
}
