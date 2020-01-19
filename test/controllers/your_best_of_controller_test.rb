# frozen_string_literal: true

require "test_helper"

class YourBestOfControllerTest < ActionDispatch::IntegrationTest
  test "should get artists" do
    get your_best_of_artists_url
    assert_response :success
  end

  test "should get tracks" do
    get your_best_of_tracks_url
    assert_response :success
  end
end
