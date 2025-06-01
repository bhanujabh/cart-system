# Dockerfile

# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app code
COPY . .

# Expose port
EXPOSE 3005

# Start the service
CMD ["npm", "start"]
