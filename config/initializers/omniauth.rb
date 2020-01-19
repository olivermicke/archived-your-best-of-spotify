# frozen_string_literal: true

require "rspotify/oauth"

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :spotify, Rails.application.credentials[Rails.env.to_sym][:SPOTIFY_CLIENT_ID], Rails.application.credentials[Rails.env.to_sym][:SPOTIFY_CLIENT_SECRET], scope: "user-top-read"
end
