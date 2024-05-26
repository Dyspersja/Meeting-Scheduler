package com.ismb.meetingscheduler.email;

import com.ismb.meetingscheduler.meeting.model.Meeting;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class EmailContentBuilder {

    private final String emailBeginning = """
            <html>
            <head>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f2f2f2;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                p {
                    margin-bottom: 10px;
                .meeting {
                    border: 1px solid #dddddd;
                    padding: 10px;
                    margin-bottom: 10px;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                    border-bottom: 1px solid #dddddd;}
                </style>
            </head>
            <body>
                <div class="container">
                    <p>Dzień dobry,</p>
                    <p>Przypominamy o nadchodzących spotkaniach</p>
            """;
    private final String emailEnd = """
                    Pozdrawiamy
                    <div className = "navbar">
                        <h1>Meeting<span>Scheduler</span></h1>
                    </div>
                </div>
            </body>
            </html>""";
    private final StringBuilder content = new StringBuilder(emailBeginning);

    public static EmailContentBuilder builder() {
        return new EmailContentBuilder();
    }

    public EmailContentBuilder addMeeting(Meeting meeting) {
        String meetingTitle = String.format("<p><strong>Nazwa spotkania:</strong> %s</p>", meeting.getTitle());
        String meetingTime = String.format("<p><strong>Godzina:</strong> %s</p>", meeting.getDateTime());
        String meetingOrganizer = String.format("<p><strong>Organizator:</strong> %s</p>", meeting.getOrganizer().getEmail());

        String text = String.format("""
                        <div class="meeting">
                            %s
                            %s
                            %s
                        </div>
                        <div style="border-top: 1px dotted #999999;">&nbsp;</div>
                """, meetingTitle, meetingTime, meetingOrganizer);

        this.content.append(text);
        return this;
    }

    public String build() {
        content.append(emailEnd);
        return content.toString();
    }
}
