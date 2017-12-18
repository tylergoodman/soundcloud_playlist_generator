

declare namespace SoundCloud {

  export interface User {
    avatar_url: string;
    first_name: string;
    full_name: string;
    id: number;
    kind: string;
    last_modified: Date;
    last_name: string;
    permalink: string;
    permalink_url: string;
    uri: string;
    urn: string;
    username: string;
    verified: boolean;
    city?: any;
    country_code?: any;
  }
  export interface PublisherMetadata {
    id: number;
    urn: string;
    artist?: string;
    album_title?: string;
    contains_music?: boolean;
    upc_or_ean?: string;
    isrc?: string;
    explicit?: boolean;
    p_line?: string;
    p_line_for_display?: string;
    release_title?: string;
  }
  export interface Track {
    artwork_url?: string;
    commentable?: boolean;
    comment_count?: number;
    created_at?: Date;
    description?: string;
    downloadable?: boolean;
    download_count?: number;
    download_url?: string;
    duration?: number;
    full_duration?: number;
    embeddable_by?: string;
    genre?: string;
    has_downloads_left?: boolean;
    id: number;
    kind?: string;
    label_name?: string;
    last_modified?: Date;
    license?: string;
    likes_count?: number;
    permalink?: string;
    permalink_url?: string;
    playback_count?: number;
    public?: boolean;
    publisher_metadata?: PublisherMetadata;
    purchase_title?: string;
    purchase_url?: string;
    release_date?: Date;
    reposts_count?: number;
    secret_token?: any;
    sharing?: string;
    state?: string;
    streamable?: boolean;
    tag_list?: string;
    title?: string;
    uri?: string;
    urn?: string;
    user_id?: number;
    visuals?: any;
    waveform_url?: string;
    display_date?: Date;
    monetization_model?: string;
    policy?: string;
    user?: User;
  }

  namespace SearchResult {
    export interface Product {
      id: string;
      name: string;
    }
    export interface CreatorSubscription {
      product: Product;
      recurring: boolean;
      hug: boolean;
    }
    export interface Product2 {
      id: string;
      name: string;
    }
    export interface CreatorSubscription2 {
      product: Product2;
      recurring: boolean;
      hug: boolean;
    }
    export interface Visual {
      urn: string;
      entry_time: number;
      visual_url: string;
    }
    export interface Visuals {
      urn: string;
      enabled: boolean;
      visuals: Visual[];
    }
    export interface User {
      avatar_url: string;
      city: string;
      comments_count: number;
      country_code: string;
      created_at: Date;
      creator_subscriptions: CreatorSubscription[];
      creator_subscription: CreatorSubscription2;
      description: string;
      followers_count: number;
      followings_count: number;
      first_name: string;
      full_name: string;
      groups_count: number;
      id: number;
      kind: string;
      last_modified: Date;
      last_name: string;
      likes_count: number;
      permalink: string;
      permalink_url: string;
      playlist_count: number;
      reposts_count?: any;
      track_count: number;
      uri: string;
      urn: string;
      username: string;
      verified: boolean;
      visuals: Visuals;
    }
  }
  export interface SearchResult {
    collection: Track[];
    total_results: number;
    next_href: string;
    query_urn: string;
  }

  export interface PlaylistCreate {
    artwork_url?: any;
    created_at: Date;
    description?: any;
    duration: number;
    embeddable_by: string;
    genre?: any;
    id: number;
    kind: string;
    label_name?: any;
    last_modified: Date;
    license: string;
    likes_count: number;
    managed_by_feeds: boolean;
    permalink: string;
    permalink_url: string;
    public: boolean;
    purchase_title?: any;
    purchase_url?: any;
    release_date?: any;
    reposts_count: number;
    secret_token: string;
    sharing: string;
    tag_list: string;
    title: string;
    uri: string;
    user_id: number;
    set_type: string;
    is_album: boolean;
    published_at?: any;
    display_date: Date;
    user: User;
    tracks: Track[];
    track_count: number;
  }

  namespace PlaylistGetList {
    export interface Playlist {
      artwork_url?: any;
      created_at: Date;
      duration: number;
      id: number;
      kind: string;
      last_modified: Date;
      likes_count: number;
      managed_by_feeds: boolean;
      permalink: string;
      permalink_url: string;
      public: boolean;
      reposts_count: number;
      secret_token: string;
      sharing: string;
      title: string;
      track_count: number;
      uri: string;
      user_id: number;
      set_type: string;
      is_album: boolean;
      published_at?: any;
      display_date: Date;
      user: User;
    }
  }
  export interface PlaylistGetList {
    collection: PlaylistGetList.Playlist[];
    next_href?: any;
    query_urn?: any;
  }

  export interface PlaylistGet {
    artwork_url?: any;
    created_at: Date;
    description?: any;
    duration: number;
    embeddable_by: string;
    genre: string;
    id: number;
    kind: string;
    label_name?: any;
    last_modified: Date;
    license: string;
    likes_count: number;
    managed_by_feeds: boolean;
    permalink: string;
    permalink_url: string;
    public: boolean;
    purchase_title?: any;
    purchase_url?: any;
    release_date?: any;
    reposts_count: number;
    secret_token: string;
    sharing: string;
    tag_list: string;
    title: string;
    uri: string;
    user_id: number;
    set_type: string;
    is_album: boolean;
    published_at?: any;
    display_date: Date;
    user: User;
    tracks: Track[];
    track_count: number;
  }

}

declare namespace YouTube {
  namespace PlaylistGet {
    export interface PageInfo {
      totalResults: number;
      resultsPerPage: number;
    }

    export interface Default {
      url: string;
      width: number;
      height: number;
    }

    export interface Medium {
      url: string;
      width: number;
      height: number;
    }

    export interface High {
      url: string;
      width: number;
      height: number;
    }

    export interface Standard {
      url: string;
      width: number;
      height: number;
    }

    export interface Maxres {
      url: string;
      width: number;
      height: number;
    }

    export interface Thumbnails {
      default: Default;
      medium: Medium;
      high: High;
      standard: Standard;
      maxres: Maxres;
    }

    export interface ResourceId {
      kind: string;
      videoId: string;
    }

    export interface Snippet {
      publishedAt: Date;
      channelId: string;
      title: string;
      description: string;
      thumbnails: Thumbnails;
      channelTitle: string;
      playlistId: string;
      position: number;
      resourceId: ResourceId;
    }

    export interface Item {
      kind: string;
      etag: string;
      id: string;
      snippet: Snippet;
    }
  }
  export interface PlaylistGet {
    kind: string;
    etag: string;
    prevPageToken?: string;
    nextPageToken?: string;
    pageInfo: PlaylistGet.PageInfo;
    items: PlaylistGet.Item[];
  }
}
