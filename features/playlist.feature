Feature: Playlist
    As a user of the best youtube app ever made
    I want to be able to view the dankest of playlists
    So that I can win at social media

    Background:
        Given a youtube playlist "sample-playlist.json" exists as "sample-playlist" from the api

    Scenario: On tablet I can view some swenk swenk youtube playlist
        Given I have a tablet device
        And I navigate to "/p/sample-playlist"
        Then I see a list of videos:
        | title           | published    | thumbnail          | summary                                                                        |
        | Swanky McSwanks | Mar 18, 1985 | swanky.jpg         | Probably the best video in the world.                                          |
        | Harambe         | May 29, 2016 | big-ole-monkey.jpg | Parental delegation gone wrong.                                                |
        | Damn daniel     | Feb 21, 2016 | white-vans.jpg     | Daniel is back at it again with them white white vans.                         |
        | Sad Ben Affleck | Mar 25, 2016 | mixed-response.jpg | Hello darkness my old friend, I've come to talk to you again..                 |
        # | Relatable       | Jul 27, 2016 | arthurs-fist.jpg   | ...                                                                            |
        # | Harold          | Oct 23, 2011 | hide-the-pain.jpg  | When you're writing dank specifications but all your memes are from last year. |

    Scenario: On tablet I can click the title of a video to navigate to the detail view
        Given I have a tablet device
        And I navigate to "/p/sample-playlist"
        And I click on the video title "Damn daniel"
        Then I see the browser navigates to "/v/daniel"

    Scenario: On tablet I can click the title of a video to navigate to the detail view and then return back to the playlist
        Given I have a tablet device
        And I navigate to "/p/sample-playlist"
        And I click on the video title "Damn daniel"
        Then I see the browser navigates to "/v/daniel"
        When I click on the back link
        Then I see the browser navigates to "/p/sample-playlist"

    Scenario: On tablet I can click the thumbnail of a video to navigate to the detail view
        Given I have a tablet device
        And I navigate to "/p/sample-playlist"
        And I click on the video thumbnail with the title "Sad Ben Affleck"
        Then I see the browser navigates to "/v/lolben"

    Scenario: On tablet I can click the thumbnail of a video to navigate to the detail view and then return back to the playlist
        Given I have a tablet device
        And I navigate to "/p/sample-playlist"
        And I click on the video thumbnail with the title "Harold"
        Then I see the browser navigates to "/v/harold"
        When I click on the back link
        Then I see the browser navigates to "/p/sample-playlist"

    Scenario: On tablet I can scroll the playlist, navigate to a video, return and be at the same scroll position
        Given I have a tablet device
        And I navigate to "/p/sample-playlist"
        When I scroll the playlist by 185px
        And I click on the video title "Harambe"
        Then I see the browser navigates to "/v/harambe"
        When I click on the back link
        Then I see the playlist scroll position is 185px


    Scenario: On mobile I can view some swenk swenk youtube playlist
        When I have a mobile device
        And I navigate to "/p/sample-playlist"
        Then I see a list of videos:
        | title           | published    | thumbnail             | summary |
        | Swanky McSwanks | Mar 18, 1985 | sm-swanky.jpg         |         |
        | Harambe         | May 29, 2016 | sm-big-ole-monkey.jpg |         |
        # | Damn daniel     | Feb 21, 2016 | sm-white-vans.jpg     |         |
        # | Sad Ben Affleck | Mar 25, 2016 | sm-mixed-response.jpg |         |
        # | Relatable       | Jul 27, 2016 | sm-arthurs-fist.jpg   |         |
        # | Harold          | Oct 23, 2011 | sm-hide-the-pain.jpg  |         |

    Scenario: On mobile I can click the title of a video to navigate to the detail view
        When I have a mobile device
        And I navigate to "/p/sample-playlist"
        And I click on the video title "Relatable"
        Then I see the browser navigates to "/v/arthur"

    Scenario: On mobile I can click the title of a video to navigate to the detail view and then return back to the playlist
        When I have a mobile device
        And I navigate to "/p/sample-playlist"
        And I click on the video title "Relatable"
        Then I see the browser navigates to "/v/arthur"
        When I click on the back link
        Then I see the browser navigates to "/p/sample-playlist"

    Scenario: On mobile I can click the thumbnail of a video to navigate to the detail view
        When I have a mobile device
        And I navigate to "/p/sample-playlist"
        And I click on the video thumbnail with the title "Harold"
        Then I see the browser navigates to "/v/harold"

    Scenario: On mobile I can click the thumbnail of a video to navigate to the detail view and then return back to the playlist
        When I have a mobile device
        And I navigate to "/p/sample-playlist"
        And I click on the video thumbnail with the title "Damn daniel"
        Then I see the browser navigates to "/v/daniel"
        When I click on the back link
        Then I see the browser navigates to "/p/sample-playlist"

    Scenario: On mobile I can scroll the playlist, navigate to a video, return and be at the same scroll position
        Given I have a mobile device
        And I navigate to "/p/sample-playlist"
        When I scroll the playlist by 122px
        And I click on the video title "Harambe"
        Then I see the browser navigates to "/v/harambe"
        When I click on the back link
        And I see the playlist scroll position is 122px
