# typed: false
# frozen_string_literal: true

require "test_helper"

class AuthCallbackControllerTest < ActionDispatch::IntegrationTest
  test "should get spotify" do
    get auth_callback_spotify_url
    assert_response :success
  end
end
