# This file is autogenerated. Do not edit it by hand. Regenerate it with:
#   srb rbi gems

# typed: true
#
# If you would like to make changes to this file, great! Please create the gem's shim here:
#
#   https://github.com/sorbet/sorbet-typed/new/master?filename=lib/omniauth/all/omniauth.rbi
#
# omniauth-1.9.0

module OmniAuth
  def self.config; end
  def self.configure; end
  def self.logger; end
  def self.mock_auth_for(provider); end
  def self.strategies; end
end
class OmniAuth::Error < StandardError
end
module OmniAuth::Strategies
end
class OmniAuth::Configuration
  def add_camelization(name, camelized); end
  def add_mock(provider, original = nil); end
  def allowed_request_methods; end
  def allowed_request_methods=(arg0); end
  def before_callback_phase(&block); end
  def before_callback_phase=(arg0); end
  def before_options_phase(&block); end
  def before_options_phase=(arg0); end
  def before_request_phase(&block); end
  def before_request_phase=(arg0); end
  def camelizations; end
  def camelizations=(arg0); end
  def failure_raise_out_environments; end
  def failure_raise_out_environments=(arg0); end
  def form_css; end
  def form_css=(arg0); end
  def full_host; end
  def full_host=(arg0); end
  def initialize; end
  def logger; end
  def logger=(arg0); end
  def mock_auth; end
  def mock_auth=(arg0); end
  def on_failure(&block); end
  def on_failure=(arg0); end
  def path_prefix; end
  def path_prefix=(arg0); end
  def self.allocate; end
  def self.default_logger; end
  def self.defaults; end
  def self.instance; end
  def self.new(*arg0); end
  def test_mode; end
  def test_mode=(arg0); end
  extend Singleton::SingletonClassMethods
  include Singleton
end
module OmniAuth::Utils
  def camelize(word, first_letter_in_uppercase = nil); end
  def deep_merge(hash, other_hash); end
  def form_css; end
  def self.camelize(word, first_letter_in_uppercase = nil); end
  def self.deep_merge(hash, other_hash); end
  def self.form_css; end
end
class OmniAuth::KeyStore < Hashie::Mash
  def self.override_logging; end
end
class OmniAuth::NoSessionError < StandardError
end
module OmniAuth::Strategy
  def app; end
  def auth_hash; end
  def call!(env); end
  def call(env); end
  def call_app!(env = nil); end
  def callback_call; end
  def callback_path; end
  def callback_phase; end
  def callback_url; end
  def credentials; end
  def current_path; end
  def custom_path(kind); end
  def dup; end
  def env; end
  def extra; end
  def fail!(message_key, exception = nil); end
  def full_host; end
  def info; end
  def initialize(app, *args, &block); end
  def inspect; end
  def log(level, message); end
  def merge_stack(stack); end
  def mock_call!(*arg0); end
  def mock_callback_call; end
  def mock_request_call; end
  def name; end
  def on_auth_path?; end
  def on_callback_path?; end
  def on_path?(path); end
  def on_request_path?; end
  def options; end
  def options_call; end
  def options_request?; end
  def path_prefix; end
  def query_string; end
  def redirect(uri); end
  def request; end
  def request_call; end
  def request_path; end
  def request_phase; end
  def response; end
  def script_name; end
  def self.included(base); end
  def session; end
  def setup_path; end
  def setup_phase; end
  def skip_info?; end
  def ssl?; end
  def uid; end
  def user_info; end
end
module OmniAuth::Strategy::ClassMethods
  def args(args = nil); end
  def compile_stack(ancestors, method, context); end
  def configure(options = nil); end
  def credentials(&block); end
  def credentials_proc; end
  def credentials_stack(context); end
  def default_options; end
  def extra(&block); end
  def extra_proc; end
  def extra_stack(context); end
  def info(&block); end
  def info_proc; end
  def info_stack(context); end
  def option(name, value = nil); end
  def uid(&block); end
  def uid_proc; end
  def uid_stack(context); end
end
class OmniAuth::Strategy::Options < OmniAuth::KeyStore
end
class OmniAuth::FailureEndpoint
  def call; end
  def env; end
  def initialize(env); end
  def origin_query_param; end
  def raise_out!; end
  def redirect_to_failure; end
  def self.call(env); end
  def strategy_name_query_param; end
end
class OmniAuth::Form
  def button(text); end
  def css; end
  def fieldset(legend, options = nil, &block); end
  def footer; end
  def header(title, header_info); end
  def html(html); end
  def initialize(options = nil); end
  def input_field(type, name); end
  def label_field(text, target); end
  def options; end
  def options=(arg0); end
  def password_field(label, name); end
  def self.build(options = nil, &block); end
  def text_field(label, name); end
  def to_html; end
  def to_response; end
end
class OmniAuth::AuthHash < OmniAuth::KeyStore
  def regular_writer(key, value); end
  def self.subkey_class; end
  def valid?; end
end
class OmniAuth::AuthHash::InfoHash < OmniAuth::KeyStore
  def name; end
  def name?; end
  def self.subkey_class; end
  def to_hash; end
  def valid?; end
end
class OmniAuth::Builder < Rack::Builder
  def before_callback_phase(&block); end
  def before_options_phase(&block); end
  def before_request_phase(&block); end
  def call(env); end
  def configure(&block); end
  def initialize(app, &block); end
  def on_failure(&block); end
  def options(options = nil); end
  def provider(klass, *args, &block); end
  def rack14?; end
  def rack2?; end
end
