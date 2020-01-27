# frozen_string_literal: true

class ApplicationController < ActionController::Base
  before_action :seo

  private
  def seo
    set_meta_tags title: "Your Best Of Spotify",
                  description: "Displays your favorite artists and tracks provided by the official Spotify API.",
                  keywords: "Spotify, Best Of, Top, Wrapped"
  end
end
