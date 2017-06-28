Feature: Playlist
    As a user of the best youtube app ever made
    I want to be able to view the dankest of playlists
    So that I can win at social media

    Background:
        Given a youtube playlist "sample-playlist.json" exists as "sample-playlist" from the api

    Scenario: On desktop I can view some swenk swenk youtube playlist
        When I have a tablet screen size
        And I navigate to the playlist "sample-playlist"
        Then I see a list of videos:
        | title           | published    | thumbnail                  | summary                                                                        |
        | Swanky McSwanks | Mar 18 1985 | swanky.jpg         | Probably the best video in the world.                                          |
        | Harambe         | May 29 2016 | big-ole-monkey.jpg | Parental delegation gone wrong.                                                |
        | Damn daniel     | Feb 21 2016 | white-vans.jpg     | Daniel is back at it again with them white white vans.                         |
        | Sad Ben Affleck | Mar 25 2016 | mixed-response.jpg | Hello darkness my old friend, I've come to talk to you again..                 |
        | Relatable       | Jul 27 2016 | arthurs-fist.jpg   | ...                                                                            |
        | Harold          | Oct 23 2011 | hide-the-pain.jpg  | When you're writing dank specifications but all your memes are from last year. |

    # Scenario: On desktop I can click the title of a video to navigate to the detail view
    #     When I have a desktop screen size
    #     And I click on the video title "Damn daniel"
    #     Then I see the browser navigates to "/v/daniel"

    # Scenario: On desktop I can click the thumbnail of a video to navigate to the detail view
    #     When I have a desktop screen size
    #     And I click on the video thumbnail with the title "Sad Ben Affleck"
    #     Then I see the browser navigates to "/v/lolben"

    # Scenario: On mobile I can view some swenk swenk youtube playlist
    #     When I have a mobile screen size
    #     Then I see a list of videos:
    #     | id      | title           | published    | thumbnail                     |
    #     | swank   | Swanky McSwanks | Mar 18, 1985 | samples/sm-swanky.png         |
    #     | harambe | Harambe         | May 29, 2016 | samples/sm-big-ole-monkey.png |
    #     | daniel  | Damn daniel     | Feb 21, 2016 | samples/sm-white-vans.png     |
    #     | lolben  | Sad Ben Affleck | Mar 25, 2016 | samples/sm-mixed-response.png |
    #     | arthur  | Relatable       | Jul 27, 2016 | samples/sm-arthurs-fist.png   |
    #     | harold  | Harold          | Oct 23, 2011 | samples/sm-hide-the-pain.png  |

    # Scenario: On mobile I can click the title of a video to navigate to the detail view
    #     When I have a mobile screen size
    #     And I click on the video title "Damn daniel"
    #     Then I see the browser navigates to "/v/daniel"

    # Scenario: On mobile I can click the thumbnail of a video to navigate to the detail view
    #     When I have a mobile screen size
    #     And I click on the video thumbnail with the title "Sad Ben Affleck"
    #     Then I see the browser navigates to "/v/lolben"
