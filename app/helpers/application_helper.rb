# frozen_string_literal: true

# Set by 'rspotify' gem.
SPOTIFY_AUTH_URL = "/auth/spotify"
SUPPORTED_BROWSERS = ["CHROME", "FIREFOX", "SAFARI"]

module ApplicationHelper
  class << self
    def is_browser_supported?(browser)
      SUPPORTED_BROWSERS.include? browser.name.upcase
    end

    def needs_force_re_render?(browser)
      browser.webkit?
    end

    def spotify_auth_url
      SPOTIFY_AUTH_URL
    end
  end
end
