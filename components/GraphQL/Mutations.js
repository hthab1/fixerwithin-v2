import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation logIn($logInInput: LogInInput!) {
    logIn(LogInInput: $logInInput) {
      _id
      name
      phone
      role
      account_status
      token
      latitude
      longitude
      profile_path
      role
      email
      phone
      bio
      verification_code
      description
      saved_place {
        _id
        longitude
        latitude
        user_defined_name
        location_name
        user {
          _id
          name
          email
          phone
          profile_path
        }
      }
    }
  }
`;

export const SIGNUP = gql`
  mutation signUp($signUpInput: SignUpInput) {
    signUp(SignUpInput: $signUpInput) {
      _id
      created_at
      name
      email
      phone
      verification_code
      account_status
      token
      profile_path
      firebase_token
      role
      fixer_category
      saved_place {
        _id
        longitude
        latitude
        user_defined_name
        location_name
      }
      work_status
      bio
      latitude
      longitude
    }
  }
`;

export const VERIFY = gql`
  mutation verify($verificationInput: VerificationInput) {
    verify(VerificationInput: $verificationInput) {
      _id
      message
      token
    }
  }
`;

export const FORGET = gql`
  mutation forgotPassword($forgotPasswordInput: ForgotPasswordInput) {
    forgotPassword(ForgotPasswordInput: $forgotPasswordInput) {
      _id
      message
    }
  }
`;

export const RESET = gql`
  mutation resetPassword($resetPasswordInput: ResetPasswordInput) {
    resetPassword(ResetPasswordInput: $resetPasswordInput) {
      _id
      message
    }
  }
`;

export const DELETE = gql`
  mutation DeleteAccount {
    deleteAccount {
      _id
      created_at
      name
      email
      phone
      verification_code
      account_status
      firebase_token
      role
      fixer_category
      saved_place {
        _id
      }
      work_status
      bio
      description
      rating
      latitude
      longitude
      profile_path
      token
    }
  }
`;

export const DISABLE_ACCOUNT = gql`
  mutation deactivateAccount {
    deactivateAccount {
      _id
      created_at
      name
      email
      phone
      verification_code
      account_status
      firebase_token
      role
      fixer_category
      saved_place {
        _id
      }
      work_status
      bio
      description
      rating
      latitude
      longitude
      profile_path
      token
    }
  }
`;

export const LOCATION = gql`
  mutation changeLocation($locationInput: LocationInput) {
    changeLocation(LocationInput: $locationInput) {
      name
      email
      latitude
      longitude
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation updateProfile($id: String!, $updateInput: UpdateInput) {
    updateProfile(_id: $id, UpdateInput: $updateInput) {
      _id
      name
      email
      phone
      bio
      profile_path
    }
  }
`;

export const BOOK = gql`
  mutation book($bookFixerInput: BookFixerInput!) {
    bookFixer(bookFixerInput: $bookFixerInput) {
      _id
      customer {
        _id
        name
      }
      fixer {
        _id
        name
      }
      job_status
    }
  }
`;

export const ADD_ADRRESS = gql`
  mutation addSavedPlace($savedPlaceInput: SavedPlaceInput!) {
    addSavedPlace(SavedPlaceInput: $savedPlaceInput) {
      _id
      user {
        name
      }
      longitude
      latitude
      user_defined_name
      location_name
    }
  }
`;

export const UPDATE_LOCATION = gql`
  mutation updateSavedPlace($id: String!, $savedPlaceInput: SavedPlaceInput!) {
    updateSavedPlace(_id: $id, SavedPlaceInput: $savedPlaceInput) {
      _id
      user {
        name
      }
      longitude
      latitude
      user_defined_name
      location_name
    }
  }
`;

export const DELETE_SAVED_PLACE = gql`
  mutation deleteSavedPlace($id: String!) {
    deleteSavedPlace(_id: $id) {
      _id
      longitude
      latitude
    }
  }
`;

export const ADD_REVIEW = gql`
  mutation addReview($reviewInput: ReviewInput!) {
    addReview(ReviewInput: $reviewInput) {
      _id
      reviewer {
        name
      }
      reviewee {
        name
      }
      review
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation deleteReview($id: String!) {
    deleteReview(_id: $id) {
      _id
      review
    }
  }
`;

export const UPDATE_REVIEW = gql`
  mutation updateReview($id: String!, $review: String!) {
    updateReview(_id: $id, review: $review) {
      review
      reviewer {
        name
      }
      reviewee {
        name
      }
    }
  }
`;

export const RESEND_OTP = gql`
  mutation resendOTP($id: String!) {
    resendOTP(_id: $id) {
      _id
      message
      token
    }
  }
`;

export const SET_FIREBASE_TOKEN = gql`
  mutation setFcmToken($firebaseToken: String!) {
    setFcmToken(firebase_token: $firebaseToken) {
      _id
      name
      email
      phone
    }
  }
`;
