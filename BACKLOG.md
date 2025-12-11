# The Brent Companion - Development Backlog

## Phase 1 - MVP ✅ COMPLETED
- Single HTML file with embedded CSS and JavaScript (React)
- Pixel art aesthetic
- Welcome screen with David Brent
- Text area for pasting application sections
- Five evaluation questions with 1-10 sliders
- David Brent dialogue responses (15 core scenarios + variations)
- Evaluation tracking in left sidebar
- Summary screen with overall feedback
- Responsive design

## Phase 2 - Enhanced Characters

### Tim Appearances
- **Trigger**: 20% chance on high self-ratings (8-10)
- **Behavior**: Appears after Brent's dialogue
- **Animation**: "The look" - Tim's pixel art sprite turns to face screen directly, holds for 1 second
- **Dialogue**: Dry, deadpan reality checks that puncture overconfidence
- **Examples**:
  - After user rates themselves 10/10: *Tim looks at camera* "Ten out of ten. Right."
  - After overly confident self-assessment: *Tim looks at camera* "Yeah, I'm sure the recruiter will be impressed by that."

### Gareth Appearances
- **Trigger**: 10% random chance after Brent speaks
- **Behavior**: Enthusiastically agrees with Brent in ways that accidentally highlight the problem
- **Character**: Worships Brent, misses the point, makes things worse
- **Examples**:
  - After Brent criticizes vague motivation: "Yeah, exactly! Like when I applied to be Assistant Regional Manager, I just said 'I want the job' and that was good enough... oh wait, I didn't get it."
  - After feedback on missing results: "David's right, you need numbers! Like when David increased productivity by... well, he increased it, that's the point!"

### Implementation Notes
- Create pixel art sprites for Tim (skeptical expression) and Gareth (eager expression)
- Write 10-15 Tim "looks" and one-liners
- Write 10-15 Gareth enthusiastic agreement responses
- Implement randomization logic for character appearances
- Ensure character interruptions feel natural, not disruptive

## Phase 3 - Brent Quote Library

### Research Phase
- Compile comprehensive collection of authentic David Brent quotes from The Office UK
- Catalog memorable moments and their contexts
- Identify Brent's speech patterns, favorite phrases, recurring themes

### Adaptation Phase
- Map authentic quotes to job application writing scenarios
- Adapt Brent moments to evaluation contexts
- Example: His "I'm not a comedian" speech could work for "trying too hard to sound impressive"
- Example: His motivational speeches could inform feedback on generic motivation

### Implementation
- Expand dialogue database to 50+ responses per criterion
- Include more authentic Brent mannerisms and catchphrases
- Add variety through quote rotation system
- Ensure adapted quotes stay true to character while remaining helpful

### Quote Categories to Cover
- Leadership and management philosophy (for employer value feedback)
- Trying to be relatable (for motivation feedback)
- Missing the point while thinking you're brilliant (for matching feedback)
- Over-explaining simple things (for conciseness feedback)
- Inappropriate analogies (usable across all criteria)

## Phase 4 - LLM-Powered Specific Feedback

### Core Functionality
- Integrate Anthropic Claude API
- Send user's actual text + criterion + self-rating to API
- Receive specific, personalized improvement advice
- David Brent delivers AI-generated feedback in character

### API Integration
- Add API key configuration (user provides their own key)
- Implement secure API calls to Anthropic
- Handle rate limiting and errors gracefully
- Add loading states while waiting for API response

### Prompt Engineering
- Create system prompt that teaches Claude to respond as David Brent
- Include character guidelines, speech patterns, example dialogue
- Provide context about the criterion being evaluated
- Request specific, actionable feedback about the user's actual text
- Ensure feedback balances humor with genuine helpfulness

### Example Prompt Structure
```
You are David Brent from The Office UK providing feedback on a job application.

Character guidelines:
- Desperately wants to be seen as competent and funny
- Uses inappropriate analogies while thinking he's being relatable
- Occasionally shows depth and vulnerability
- Delivers insight despite the cringe

The user is evaluating this criterion: [MOTIVATION SPECIFICITY]
They rated themselves: [7/10]
Their actual text: [USER'S PASTED TEXT]

Provide feedback in 3-4 sentences as David Brent that:
1. Reacts to their self-rating in character
2. Makes a characteristic Brent analogy
3. Points specifically at what they wrote and how to improve it
4. References the research: 63% of employers say specific motivation is crucial
```

### User Experience
- Toggle between rule-based and AI-powered feedback
- Show loading indicator: "Brent is thinking..."
- Cache API responses to reduce costs
- Fallback to rule-based dialogue if API fails

### Cost Considerations
- Use Claude Haiku for cost-efficiency
- Implement request throttling (max 5 API calls per session?)
- Allow users to choose when to use AI feedback vs. rule-based
- Display estimated cost per evaluation

## Phase 5 - Additional Features

### Save/Load Functionality
- Save evaluations to browser localStorage
- Name and organize different job applications
- Track revision history for each application
- Export evaluations as JSON

### Progress Tracking
- Dashboard showing all evaluated applications
- Quality trends over time
- Average scores per criterion across applications
- "Most improved" areas visualization

### Export Capabilities
- Export summary as PDF reference sheet
- Markdown format for note-taking
- Checklist format for Word document
- Email summary to yourself

### Visual Enhancements
- Multiple office scenes for variety (meeting room, break room, Brent's office)
- More detailed pixel art character animations
- Subtle background animations (flickering monitor, moving clock)
- Sound effects (keyboard typing, office ambience, occasional "that's what she said")
- Optional background music in pixel art game style

### Additional Characters (Long-term)
- Dawn: Offers encouraging, supportive feedback (counterbalances Brent's awkwardness)
- Keith: Deadpan accountant perspective on "measurable results"
- Finchy: Overconfident bravado that serves as a cautionary example

### Quality of Life
- Dark mode / light mode toggle
- Font size adjustment
- Keyboard shortcuts for navigation
- Undo rating / go back to previous criterion
- "Why this matters" tooltips with research data
- Tips library (access Ballisager research summaries)

### Gamification (Optional)
- Achievement badges (e.g., "Five Perfect 10s", "Honest Self-Evaluator")
- Streak tracking (days in a row using the tool)
- "Brent's Approval Rating" based on consistency of use
- Unlockable character variations (Brent in different moods/outfits)

## Phase 6 - Mobile Application (Future Consideration)
- Native mobile app for iOS/Android
- Simplified interface optimized for phone screens
- Push notifications for revision reminders
- Integration with mobile Word/Google Docs

## Technical Debt & Improvements

### Code Organization
- Refactor into separate React components file
- Extract dialogue to JSON files
- Add TypeScript for better type safety
- Implement proper state management (Redux/Context)

### Testing
- Add unit tests for dialogue selection logic
- Test responsive design across devices
- User testing sessions for dialogue quality
- A/B testing different feedback approaches

### Performance
- Optimize bundle size
- Lazy load character artwork
- Implement service worker for offline use
- Add proper loading states

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode
- Text-to-speech for Brent's dialogue (in his voice?)

## Research & Validation

### Ongoing Research
- Monitor new Ballisager and djøf guidance
- Track changes in employer preferences
- Update criteria weights based on latest data
- Collect user feedback on helpfulness

### User Studies
- Track which feedback leads to actual improvements
- Measure whether self-evaluation approach works better than automatic analysis
- Test if humor increases consistent usage
- Validate that users actually revise based on feedback

---

## Priority Order for Next Sessions

1. **Phase 2** - Enhanced characters (Tim and Gareth) add variety and deeper humor
2. **Phase 3** - Quote library makes Brent more authentic and endlessly entertaining
3. **Phase 4** - LLM integration makes feedback dramatically more useful
4. **Phase 5** - Additional features based on user needs after testing Phases 2-4

## Notes for Future Development

- Keep the core self-evaluation loop intact - that's what makes this effective
- Humor should never overshadow learning - if a joke doesn't also teach, cut it
- Test with real job applications to validate helpfulness
- Consider interviewing Danish recruiters to validate criteria priorities
- Keep load times fast - user should be able to quickly check a paragraph
- David Brent works because he's endearing despite being cringey - maintain that balance
