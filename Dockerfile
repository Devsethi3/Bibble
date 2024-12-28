# Use Node.js image
FROM node:18-alpine
# Set working directory
WORKDIR /app
# Install prisma globally to ensure it's available
RUN npm install -g prisma
# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/
# Install dependencies
RUN npm ci
# Copy the rest of the application
COPY . .
# Generate Prisma client
RUN npx prisma generate
# Build the application
RUN npm run build
# Expose port
EXPOSE 3000
# Start command for Next.js
CMD ["npm", "start"]
