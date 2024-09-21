pipeline {
    agent {
        docker {
            image 'node:latest'  // Use the Node.js image for the pipeline
            args '-v jenkins_home:/var/lib/docker/volumes/jenkins_home/_data'
        }
    }

    tools {
        nodejs "NodeJS"  // Node.js installation name in Jenkins Global Tool Configuration
    }

    environment {
        APP_NAME = 'registration-api'
        IMAGE_NAME = 'your-docker-username/${APP_NAME}' // Replace with your Docker Hub username or appropriate image name
        DEPLOY_DIR = '/var/www/registration-api' // Directory to deploy the app
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
                    sh '''
                    docker build -t ${IMAGE_NAME}:latest .
                    '''
                }
            }
        }
        
        stage('Check Deploy Directory') {
            steps {
                script {
                    // This step is not necessary if you're using Docker
                    echo "Deploy directory check is unnecessary for Docker deployment."
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Stop and remove existing container if it exists
                    sh '''
                    if [ "$(docker ps -q -f name=${APP_NAME})" ]; then
                        echo "Stopping existing container ${APP_NAME}..."
                        docker stop ${APP_NAME}
                        echo "Removing existing container ${APP_NAME}..."
                        docker rm ${APP_NAME}
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
        }
        success {
            echo 'Build, Test, and Deployment completed successfully.'
        }
        failure {
            echo 'Build or Deployment failed.'
        }
    }
}
