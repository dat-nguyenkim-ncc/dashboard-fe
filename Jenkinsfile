pipeline {
    agent any
    options {
        buildDiscarder logRotator(numToKeepStr:'5', daysToKeepStr: '', artifactNumToKeepStr: '5', artifactDaysToKeepStr: '')
        disableConcurrentBuilds()
    }
    tools {
        dockerTool "docker"
    }
    environment {
        DOCKER_IMAGE = "datmaster/dattest"
        DOCKER_TAG = "fe-${GIT_BRANCH.tokenize('/').pop()}-${GIT_COMMIT.substring(0,7)}"
        SSH_CONFIG_NAME = "frontend"
    }
    stages {
        stage("testing") {
            steps {
                // defined testing phase here
                echo "Passed testing"
                //
            }
        }
        stage("build") {
            when {
                branch 'master'
            }
            steps {
                sh "docker build -t ${env.DOCKER_IMAGE}:${env.DOCKER_TAG} ."
                withCredentials([usernamePassword(credentialsId: 'docker-hub', passwordVariable: 'pass', usernameVariable: 'user')]) {
                    sh "docker login -u $user -p $pass"
                }
                script {
                    if (GIT_BRANCH ==~ /.*master.*/) {
                        sh "docker tag ${env.DOCKER_IMAGE}:${env.DOCKER_TAG} ${env.DOCKER_IMAGE}:fe-latest"
                        sh "docker push ${env.DOCKER_IMAGE}:fe-latest"
                        //env.DOCKER_TAG = "latest"
                        sh "docker rmi ${env.DOCKER_IMAGE}:fe-latest"
                    } else {
                        sh "docker push ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}"
                    }
                }
                sh "docker image ls | grep ${env.DOCKER_TAG}"
                sh "docker rmi ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}"
                sh 'docker rmi $(docker images -f "dangling=true" -q)'
            }
        }
        stage('SSH transfer') {
                when {
                    branch 'master'
                }
                environment {
                    DEPLOY_DIR = "./deploy"
                    COMPOSE_FILE = "docker-compose.yaml"
                }
                steps {
                     script {
                          sshPublisher(
                           continueOnError: true,
                           publishers: [
                            sshPublisherDesc(
                             configName: "${env.SSH_CONFIG_NAME}",
                             verbose: true,
                             transfers: [
                                 sshTransfer(
                                     execCommand: "mkdir -p ${env.DEPLOY_DIR}"
                                 ),
                                 sshTransfer(
                                     execCommand: "export DOCKER_IMAGE=${env.DOCKER_IMAGE} && export DOCKER_TAG=fe-latest && cd ${env.DEPLOY_DIR} && docker-compose down"
                                 ),
                                 sshTransfer(
                                    execCommand: "docker rmi ${env.DOCKER_IMAGE}:fe-latest"
                                 ),
                                 sshTransfer(
                                    execCommand: "docker pull ${env.DOCKER_IMAGE}:fe-latest"
                                 ),
                                 sshTransfer(
                                    sourceFiles: "${env.COMPOSE_FILE}",
                                    //removePrefix: "./",
                                    remoteDirectory: "${env.DEPLOY_DIR}",
                                    execCommand: "export DOCKER_IMAGE=${env.DOCKER_IMAGE} && export DOCKER_TAG=fe-latest && cd ${env.DEPLOY_DIR} && docker-compose up -d"
                                  )
                             ])
                           ])
                    }
                }
            }
    }
}
