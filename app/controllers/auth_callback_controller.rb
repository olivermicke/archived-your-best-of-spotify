# frozen_string_literal: true

class AuthCallbackController < ApplicationController
  def spotify
    user = RSpotify::User.new(request.env["omniauth.auth"])
    session[:spotify_user_hash] = user.to_hash

    redirect_to your_best_of_artists_url
  end
end
