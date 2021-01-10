FROM ruby:2.6.0

RUN apt-get update && apt-get install -y && \
  curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
  apt-get update && apt-get install -y nodejs yarn

WORKDIR /usr/app

COPY Gemfile .
COPY Gemfile.lock .
RUN gem update bundler
RUN bundle install

COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]
