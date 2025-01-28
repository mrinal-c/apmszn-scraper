/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 &
echo "Waiting for Chrome to start..."
sleep 5
echo "Starting Puppeteer script..."
npm start