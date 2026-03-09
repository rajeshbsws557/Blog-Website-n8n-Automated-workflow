# Google AdSense Setup Guide for Daily Developer Insights

This guide will walk you through setting up Google AdSense on your Next.js blog to start earning revenue from your content.

---

## Step 1: Get Your AdSense Publisher ID

1. **Sign up for Google AdSense**: https://www.google.com/adsense/start
2. **Submit your site for review**: Enter `https://dailydeveloperinsights.tech`
3. **Wait for approval** (typically 1-2 weeks, sometimes longer)
4. **Get your Publisher ID**: Once approved, find it in your AdSense dashboard
   - Format: `ca-pub-XXXXXXXXXXXXXXXX` (16-digit number)

---

## Step 2: Add Your Publisher ID to the Website

### Option A: Meta Tag Verification (Recommended for Initial Setup)

Edit `src/app/layout.tsx` and uncomment the verification line:

```tsx
<head>
  {/* Google AdSense Verification */}
  <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX" />
</head>
```

Replace `ca-pub-XXXXXXXXXXXXXXXX` with your actual publisher ID.

### Option B: Script Tag (Already Implemented)

The AdSense script is already implemented in `src/app/layout.tsx` via the `AdSenseScript` component. Simply update the placeholder:

```tsx
<AdSenseScript publisherId="ca-pub-XXXXXXXXXXXXXXXX" />
```

---

## Step 3: Create Ad Units in AdSense Dashboard

1. Go to **Ads > Overview** in your AdSense dashboard
2. Click **Create ad unit**
3. Select **Display ads** for standard ad units
4. Choose a name for each ad unit (e.g., "Article Top", "Feed Ad 1")
5. Select the ad size:
   - **Responsive** (recommended) - Automatically adjusts to container
   - **Fixed sizes** - Specific dimensions

### Suggested Ad Unit Configuration

Create these ad units for optimal placement:

| Ad Unit Name | Location | Recommended Size |
|--------------|----------|------------------|
| `article_top` | After featured image, before content | Responsive |
| `article_middle` | Middle of long articles (>2000 chars) | Responsive |
| `article_bottom` | End of article, before navigation | Responsive |
| `feed_1` | After 3rd blog card in feed | Responsive |
| `feed_2` | After 6th blog card in feed | Responsive |
| `sidebar` | Sidebar (if you add one) | 300x250 or 300x600 |
| `leaderboard` | Below hero section | 728x90 or Responsive |

---

## Step 4: Insert Your Ad Slot IDs

After creating ad units in AdSense, you'll receive ad slot IDs. Update the placeholder IDs in these files:

### File: `src/components/BlogPostContent.tsx`

```tsx
// After featured image
<AdUnit
  slot="YOUR_AD_SLOT_ID_1"  // ← Replace with article_top slot ID
  format="responsive"
  className="my-8"
/>

// Middle of content (for long articles)
<AdUnit
  slot="YOUR_AD_SLOT_ID_2"  // ← Replace with article_middle slot ID
  format="responsive"
  className="my-8"
/>

// End of article
<AdUnit
  slot="YOUR_AD_SLOT_ID_3"  // ← Replace with article_bottom slot ID
  format="responsive"
  className="my-8"
/>
```

### File: `src/components/BlogFeed.tsx`

```tsx
// After every 3 blog cards
<AdUnit
  slot={`YOUR_FEED_AD_SLOT_ID_${Math.floor((index + 1) / 3)}`}
  // Replace with feed_1, feed_2, feed_3 slot IDs
  format="responsive"
  className="min-h-[250px]"
/>
```

### Optional: Hero Leaderboard Ad

File: `src/components/Hero.tsx` (uncomment when ready)

```tsx
{/* Leaderboard Ad - Below Newsletter */}
<div className="mt-12">
  <AdUnit slot="YOUR_LEADERBOARD_SLOT_ID" format="horizontal" />
</div>
```

---

## Step 5: Deploy and Verify

1. **Build your project**:
   ```bash
   npm run build
   ```

2. **Test locally**:
   ```bash
   npm run dev
   ```
   - Check that the cookie consent banner appears
   - Accept advertising cookies
   - Verify ad placeholders are visible

3. **Deploy to production**:
   ```bash
   git add .
   git commit -m "Add Google AdSense integration with GDPR compliance"
   git push origin main
   ```

4. **Verify in AdSense dashboard**:
   - Go to **Sites > Your site**
   - Check status shows "Ready"
   - Wait for ads to start serving (can take 24-48 hours)

---

## Best Practices for Ad Placement

### Do:
- ✅ Place ads where they don't disrupt the reading flow
- ✅ Use responsive ad units for mobile compatibility
- ✅ Keep at least 1 paragraph of content between ads
- ✅ Test on mobile devices (50%+ of traffic)
- ✅ Monitor Core Web Vitals (ads shouldn't hurt performance)

### Don't:
- ❌ Place ads above the fold that push content down
- ❌ Use more than 3 ad units per page initially
- ❌ Click your own ads (will get you banned)
- ❌ Ask others to click ads
- ❌ Use pop-ups, pop-unders, or interstitial ads
- ❌ Refresh pages automatically to generate impressions

---

## Policy Compliance Checklist

Before applying for AdSense, ensure:

- [ ] **Original Content**: All articles are original, not copied
- [ ] **No Copyrighted Images**: Use Unsplash, Pexels, or your own images
- [ ] **Clear Navigation**: Menu works, pages load correctly
- [ ] **About Page**: Shows who you are (E-E-A-T signal)
- [ ] **Privacy Policy**: Explains cookie/advertising use ✓
- [ ] **Terms of Service**: Legal protection ✓
- [ ] **No Prohibited Content**: No adult, gambling, drugs, weapons content
- [ ] **Mobile Responsive**: Site works on phones ✓
- [ ] **Fast Loading**: Core Web Vitals in good standing

---

## Troubleshooting

### "Ad units not showing"
- Check browser console for errors
- Verify you've accepted advertising cookies in the cookie banner
- Wait 24-48 hours after initial AdSense approval

### "Blank ad spaces"
- Normal for new sites - Google needs time to match ads
- Ensure content is substantial (aim for 20+ quality articles)
- Check AdSense dashboard for policy violations

### "Low earnings"
- Focus on increasing traffic first
- Write about high-value topics (AI, finance, technology)
- Optimize ad placement based on heatmaps
- Test different ad formats

---

## GDPR Compliance Features

This implementation includes:

1. **Cookie Consent Banner**: Users must opt-in to advertising cookies
2. **Granular Controls**: Separate toggles for Essential, Analytics, Advertising
3. **Easy Opt-out**: Links to Google Ad Settings in footer and banner
4. **Privacy Policy**: Detailed explanation of data use ✓
5. **No Pre-selection**: Advertising cookies are off by default

---

## Need Help?

- **AdSense Help Center**: https://support.google.com/adsense
- **AdSense Policies**: https://support.google.com/adsense/topic/1250106
- **Contact**: contact@dailydeveloperinsights.tech

---

*Last updated: March 2026*