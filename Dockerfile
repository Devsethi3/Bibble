# Use Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application (if needed)
RUN npm run build

# Expose port (change if your app uses a different port)
EXPOSE 3000

# Start command
CMD ["npm", "start"]