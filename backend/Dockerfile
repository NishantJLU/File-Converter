# Use Node.js base image
FROM node:18-slim

# Install qpdf system package for the Unlock PDF feature
RUN apt-get update && apt-get install -y \
    qpdf \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application files
COPY . .

# Create temp directory if it doesn't exist
RUN mkdir -p temp

# Expose backend port
EXPOSE 5000

# Start command
CMD ["node", "src/index.js"]
