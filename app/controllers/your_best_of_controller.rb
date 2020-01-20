# frozen_string_literal: true

class YourBestOfController < ApplicationController
  before_action :ensure_spotify_user_hash, unless: -> { use_mocked_data? }

  def artists
    @artists = User.top_artists user_params
    @uses_mocked_data = use_mocked_data? || false
  end

  def tracks
    @tracks = User.top_tracks user_params
    @uses_mocked_data = use_mocked_data? || false
  end

  private
  def ensure_spotify_user_hash
    if session[:spotify_user_hash].nil?
      redirect_to ApplicationHelper.spotify_auth_url
    end
  end

  def use_mocked_data?
    request.params["mocked"]
  end

  def user_params
    { spotify_user_hash: session[:spotify_user_hash], use_mocked_data?: use_mocked_data? }
  end
end
