# frozen_string_literal: true

class YourBestOfController < ApplicationController
  before_action :ensure_user_hash

  def artists
    @artists = user.top_artists(limit: 15, time_range: "long_term")
  end

  def tracks
    @tracks = user.top_tracks(limit: 15, time_range: "long_term")
  end

  private
    def ensure_user_hash
      if session[:spotify_user_hash].nil?
        redirect_to "/auth/spotify"
      end
    end

    def user
      RSpotify::User.new(session[:spotify_user_hash])
    end
end
