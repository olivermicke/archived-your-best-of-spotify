# frozen_string_literal: true

require "mocked_data"

LIMIT = 50
TIME_RANGE = "long_term"

class User
  class << self
    def top_artists(params)
      if params[:use_mocked_data?]
        MockedData.artists
      else
        user(params[:spotify_user_hash]).top_artists(limit: LIMIT, time_range: TIME_RANGE)
      end
    end

    def top_tracks(params)
      if params[:use_mocked_data?]
        MockedData.tracks
      else
        user(params[:spotify_user_hash]).top_tracks(limit: LIMIT, time_range: TIME_RANGE)
      end
    end

    private
    def user(spotify_user_hash)
      RSpotify::User.new spotify_user_hash
    end
  end
end
