# frozen_string_literal: true

require "rspotify/oauth"

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :spotify, Rails.application.credentials[:spotify_client_id], Rails.application.credentials[:spotify_client_secret], scope: "user-top-read"
end
