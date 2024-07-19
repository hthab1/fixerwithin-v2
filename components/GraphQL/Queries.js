import { gql } from "@apollo/client";

export const LOAD_USER = gql`
  query {
    me {
      _id
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
        created_at
        user {
          _id
          name
          email
          phone
          account_status
          profile_path
          token
        }
        longitude
        latitude
        user_defined_name
        location_name
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

export const LOAD_FIXERS = gql`
  query {
    getAvailableFixers {
      _id
      latitude
      longitude
      name
      phone
      profile_path
      description
      bio
      rating
      fixer_category
    }
  }
`;

export const LOAD_SAVED_PLACES = gql`
  query {
    getAllSavedPlaces {
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

export const LOAD_ALL_REVIEW = gql`
  query getAllReviews($fixer_id: String!) {
    getAllReviews(fixer_id: $fixer_id) {
      _id
      title
      review
      rating
      created_at
      reviewer {
        _id
        profile_path
        name
      }
      reviewee {
        _id
      }
    }
  }
`;

export const LOAD_NOTIFICATIONS = gql`
  query {
    inAppNotifications {
      _id
      created_at
      date
      location
      job_status
      __typename
      fixer {
        name
        email
        phone
        profile_path
        _id
      }
      customer {
        email
        name
        _id
        phone
        account_status
        profile_path
        __typename
      }
    }
  }
`;

export const Get_FIXER = gql`
  query getFixer($id: String!) {
    getFixer(_id: $id) {
      latitude
      longitude
      rating
      profile_path
      name
      phone
      description
      bio
      fixer_category
    }
  }
`;
