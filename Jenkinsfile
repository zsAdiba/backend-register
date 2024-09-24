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

        stage('Start Server') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                script {
                    // Start the server if tests passed
                    sh 'node server.js &'
                    echo 'Server started successfully.'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    sh '''
                    sudo docker build -t ${IMAGE_NAME}:latest .
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Stop and remove existing container if it exists
                    sh '''
                    if [ "$(sudo docker ps -q -f name=${APP_NAME})" ]; then
                        echo "Stopping existing container ${APP_NAME}..."
                        sudo docker stop ${APP_NAME}
                        echo "Removing existing container ${APP_NAME}..."
                        sudo docker rm ${APP_NAME}
                    fi

                    // Run the new container
                    echo "Deploying new container ${APP_NAME}..."
                    docker run -d --name ${APP_NAME} -p 3002:3000 ${IMAGE_NAME}:latest
                    '''
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
