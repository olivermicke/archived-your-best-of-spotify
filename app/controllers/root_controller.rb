# typed: strict
# frozen_string_literal: true

class RootController < ApplicationController
  extend T::Sig

  sig {void}
  def index
  end
end
