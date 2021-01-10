# typed: false
# frozen_string_literal: true

class YourBestOfController < ApplicationController
  extend T::Sig

  before_action :ensure_spotify_user_hash, unless: -> { use_mocked_data? }

  sig {void}
  def artists
    @artists = User.top_artists user_params
    @uses_mocked_data = use_mocked_data? || false
  end

  sig {void}
  def genres
    artists = User.top_artists user_params

    artists_genres = artists.map(&:genres)
    total_genres = artists_genres.reduce(0) { |n, arr| n + arr.length }

    genres_counted = Hash.new(0)
    artists_genres.each do |artist|
      artist.each do |genre|
        genres_counted[genre] += 1
      end
    end

    top_genres = genres_counted.sort_by { |k, v| v }.reverse.take(10).to_h
    top_genres_with_percentages = top_genres.transform_values { |n| ((n.to_f / total_genres.to_f) * 100).round }

    remaining_percentage = 100 - top_genres_with_percentages.values.sum
    @genres = (top_genres_with_percentages.merge({ "other" => remaining_percentage })).sort_by { |k, v| v }.reverse.to_h
    @uses_mocked_data = use_mocked_data? || false
  end


  sig {void}
  def tracks
    @tracks = User.top_tracks user_params
    @uses_mocked_data = use_mocked_data? || false
  end

  private

  sig {void}
  def ensure_spotify_user_hash
    if session[:spotify_user_hash].nil?
      redirect_to ApplicationHelper.spotify_auth_url
    end
  end

  sig {returns(ActiveModel::Type::Boolean)}
  def use_mocked_data?
    request.params["mocked"]
  end

  sig {returns({spotify_user_hash: String, use_mocked_data?: ActiveModel::Type::Boolean})}
  def user_params
    { spotify_user_hash: session[:spotify_user_hash], use_mocked_data?: use_mocked_data? }
  end
end
