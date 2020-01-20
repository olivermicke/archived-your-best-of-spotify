# frozen_string_literal: true

DEFAULT_REDIRECT_PATH = "/artists"

class AuthCallbackController < ApplicationController
  def spotify
    user = RSpotify::User.new(request.env["omniauth.auth"])
    session[:spotify_user_hash] = user.to_hash

    redirect_to DEFAULT_REDIRECT_PATH
  end
end
