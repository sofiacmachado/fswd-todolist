module Api
  class UsersController < ApplicationController
    skip_before_action :verify_authenticity_token
    def create
      user = User.new()

      if user.save
        render json: { success: true, id: user.id }
      else
        render json: { success: false }
      end
    end
  end
end