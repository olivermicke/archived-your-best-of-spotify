# frozen_string_literal: true

namespace :scss do
  task :lint do
    sh "scss-lint app/assets/stylesheets"
  end
end
