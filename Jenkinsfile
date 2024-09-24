pipeline {

    agent any

    tools {
        nodejs "NodeJS"  // Node.js installation name in Jenkins Global Tool Configuration
    }

    environment {
        APP_NAME = 'registration-api'
        IMAGE_NAME = 'rootx/registration-api' // Replace with your Docker Hub username or appropriate image name
        DEPLOY_DIR = '/app/registration-api' // Directory to deploy the app
    }

    stages {
        stage('Clone Repository') {
            steps {
                // Clone the Git repository from the remote URL
                git branch: 'main', url: 'https://github.com/zsAdiba/backend-register.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Install npm dependencies
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // Run tests
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    sh 'docker build -t ${IMAGE_NAME} .'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Starting deployment and activation...'
                script {
                    // Check if the container is created
                    def containerId = sh(script: "docker ps -a -q -f name=${APP_NAME}", returnStdout: true).trim()
                    if (containerId) {
                        echo "Stopping existing container ${APP_NAME}..."
                        sh "docker stop ${APP_NAME}"
                        echo "Removing existing container ${APP_NAME}..."
                        sh "docker rm ${APP_NAME}"
                    } else {
                        echo "No existing container named ${APP_NAME} found."
                    }
                }
                
                // Run the new container
                echo "Deploying new container ${APP_NAME}..."
                //sh "docker run -d --name ${APP_NAME} -p 3002:3002 ${IMAGE_NAME}"
                sh "docker run -d -p 3002:3002 --name ${APP_NAME} ${IMAGE_NAME}"
            }
        }

        stage('Clean Up') {
            steps {
                script {
                    sh 'docker rmi $(docker images -f "dangling=true" -q) || true'
                }
            }
        }
    }

    post {
        always {
            // Clean up workspace after build
            cleanWs()
            echo 'Pipeline Build, Test, and Deployment finished.'
        }
        success {
            echo 'Build, Test, and Deployment completed successfully.'
        }
        failure {
            echo 'Build or Deployment failed.'
        }
    }
}
