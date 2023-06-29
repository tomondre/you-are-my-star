terraform {
  cloud {
    organization = "raspberry-kubernetes-cluster"

    workspaces {
      tags = ["tomondre-you-are-star"]
    }
  }
}

#module "star_deployment" {
#  source    = "git::https://github.com/tomondre/raspberry-kubernetes-cluster.git//terraform-modules/reusable-modules/cron-job"
#  image_tag = var.image_tag
#  image_url = "docker.io/tomondre/you-are-my-star"
#  name      = "you-are-my-star"
#  cron      = "*/10 * * * *"
#  env       = {
#    GITHUB_TOKEN = var.github_token
#  }
#}

variable "image_tag" {}
variable "github_token" {}
