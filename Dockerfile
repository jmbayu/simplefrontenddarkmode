FROM node:16.20.2
# set working directory
WORKDIR /code/fe


# add `/code/fe/node_modules/.bin` to $PATH
ENV PATH /code/fe/node_modules/bin:$PATH
COPY package.json ./
COPY package-lock.json ./

# Silent clean install of npm
RUN npm ci --loglevel=verbose
RUN npm install react-scripts@3.0.1 -g --loglevel=verbose

# add app
COPY . /code/fe/

# Build production
RUN npm run build --loglevel=verbose
RUN npm install -g serve

## Start the app on port 3006
CMD ["serve", "-s", "build", "-l", "3009"]
