# Coopsama App - Troubleshooting Guide

## Common Issues & Solutions

### Authentication Issues

#### Problem: Login fails with "Invalid credentials"
**Symptoms:**
- User cannot log in with correct credentials
- Error message shows "Invalid credentials"

**Solutions:**
1. **Check email format**: Ensure email is properly formatted
2. **Verify password**: Check for typos and case sensitivity
3. **Check Supabase connection**: Verify environment variables
4. **Clear browser cache**: Clear localStorage and cookies
5. **Check user status**: Verify user account is not disabled

```typescript
// Debug authentication
console.log('Auth state:', supabase.auth.getSession());
console.log('User:', supabase.auth.getUser());
```

#### Problem: Session expires unexpectedly
**Symptoms:**
- User gets logged out frequently
- "Session expired" error messages

**Solutions:**
1. **Check token refresh**: Verify auto-refresh is enabled
2. **Check network connectivity**: Ensure stable internet connection
3. **Verify Supabase configuration**: Check auth settings
4. **Clear corrupted session**: Clear localStorage and re-login

#### Problem: User profile not loading
**Symptoms:**
- Dashboard shows "Loading..." indefinitely
- Profile data not displayed

**Solutions:**
1. **Check RLS policies**: Verify user has access to profile data
2. **Check database connection**: Verify Supabase is accessible
3. **Check user ID**: Ensure user ID is correctly passed
4. **Refresh data**: Try refreshing the page or clearing cache

### Form Issues

#### Problem: Form data not saving
**Symptoms:**
- Draft data is lost
- "Save failed" error messages
- Form resets unexpectedly

**Solutions:**
1. **Check network connection**: Ensure stable internet
2. **Verify form validation**: Check for validation errors
3. **Check Supabase permissions**: Verify RLS policies
4. **Clear form cache**: Clear localStorage and retry
5. **Check data format**: Ensure data matches expected schema

```typescript
// Debug form saving
console.log('Form data:', formData);
console.log('Validation errors:', errors);
console.log('Network status:', navigator.onLine);
```

#### Problem: Form navigation not working
**Symptoms:**
- Cannot move between form steps
- Navigation buttons disabled
- Form stuck on current step

**Solutions:**
1. **Check step validation**: Ensure current step is complete
2. **Verify form state**: Check form context is properly initialized
3. **Check required fields**: Ensure all required fields are filled
4. **Refresh form**: Try refreshing the page
5. **Check console errors**: Look for JavaScript errors

#### Problem: Form data not loading from draft
**Symptoms:**
- Draft data not restored when editing
- Form starts empty instead of loading saved data
- "Draft not found" error

**Solutions:**
1. **Check draft ID**: Verify application ID is correct
2. **Check database query**: Verify draft exists in database
3. **Check data format**: Ensure draft data is properly formatted
4. **Clear cache**: Clear localStorage and reload
5. **Check permissions**: Verify user has access to draft

### Document Upload Issues

#### Problem: Camera not working
**Symptoms:**
- Camera permission denied
- Camera interface not opening
- "Camera not available" error

**Solutions:**
1. **Check permissions**: Grant camera permission in browser/device
2. **Check HTTPS**: Ensure app is served over HTTPS
3. **Check device compatibility**: Verify device supports camera
4. **Restart browser**: Close and reopen browser
5. **Check Capacitor configuration**: Verify camera plugin setup

```typescript
// Debug camera
import { Camera } from '@capacitor/camera';

const checkCamera = async () => {
  try {
    const permissions = await Camera.checkPermissions();
    console.log('Camera permissions:', permissions);
  } catch (error) {
    console.error('Camera error:', error);
  }
};
```

#### Problem: Document upload fails
**Symptoms:**
- Upload progress stuck
- "Upload failed" error messages
- Documents not appearing in form

**Solutions:**
1. **Check file size**: Ensure file is under size limit
2. **Check file format**: Verify file is supported format (JPEG, PNG)
3. **Check network**: Ensure stable internet connection
4. **Check storage permissions**: Verify Supabase storage access
5. **Retry upload**: Try uploading again

#### Problem: Document not displaying
**Symptoms:**
- Uploaded documents not showing
- "Document not found" error
- Broken image links

**Solutions:**
1. **Check file path**: Verify file was uploaded correctly
2. **Check storage bucket**: Verify file is in correct bucket
3. **Check permissions**: Verify RLS policies allow access
4. **Check URL generation**: Verify public URL is generated correctly
5. **Refresh page**: Try refreshing to reload documents

### Offline Issues

#### Problem: App not working offline
**Symptoms:**
- App shows "No internet" error
- Forms not accessible offline
- Data not syncing when online

**Solutions:**
1. **Check service worker**: Verify PWA is properly installed
2. **Check cache**: Ensure data is cached locally
3. **Check offline storage**: Verify LocalForage is working
4. **Reinstall PWA**: Uninstall and reinstall app
5. **Check browser support**: Verify browser supports offline features

```typescript
// Debug offline functionality
console.log('Online status:', navigator.onLine);
console.log('Service worker:', navigator.serviceWorker);
console.log('LocalForage:', localforage);
```

#### Problem: Data not syncing when online
**Symptoms:**
- Changes made offline not syncing
- "Sync failed" error messages
- Data conflicts between devices

**Solutions:**
1. **Check sync queue**: Verify offline queue is processing
2. **Check network**: Ensure stable internet connection
3. **Check conflicts**: Resolve data conflicts manually
4. **Force sync**: Try manual sync or refresh
5. **Clear offline data**: Clear LocalForage and resync

### Performance Issues

#### Problem: App loads slowly
**Symptoms:**
- Long loading times
- White screen for extended periods
- App freezes during loading

**Solutions:**
1. **Check bundle size**: Analyze bundle for large dependencies
2. **Check network**: Ensure fast internet connection
3. **Clear cache**: Clear browser cache and data
4. **Check device resources**: Ensure sufficient memory/CPU
5. **Optimize images**: Compress images before upload

#### Problem: App crashes on mobile
**Symptoms:**
- App closes unexpectedly
- "App has stopped" error
- Memory issues

**Solutions:**
1. **Check device compatibility**: Verify device meets requirements
2. **Update app**: Ensure latest version is installed
3. **Clear app data**: Clear app cache and data
4. **Restart device**: Restart mobile device
5. **Check memory**: Ensure sufficient available memory

### Database Issues

#### Problem: Data not saving to database
**Symptoms:**
- Changes not persisting
- "Database error" messages
- Data loss

**Solutions:**
1. **Check RLS policies**: Verify user has write permissions
2. **Check data format**: Ensure data matches schema
3. **Check network**: Verify stable connection to Supabase
4. **Check constraints**: Verify data meets database constraints
5. **Retry operation**: Try saving again

#### Problem: Queries returning empty results
**Symptoms:**
- No data displayed
- "No results found" messages
- Empty lists

**Solutions:**
1. **Check query filters**: Verify query conditions are correct
2. **Check RLS policies**: Verify user has read permissions
3. **Check data existence**: Verify data exists in database
4. **Check query syntax**: Verify query is properly formatted
5. **Test with simple query**: Try basic query without filters

### Mobile-Specific Issues

#### Problem: App not installing on mobile
**Symptoms:**
- Install prompt not showing
- Installation fails
- App not appearing in home screen

**Solutions:**
1. **Check PWA requirements**: Verify all PWA criteria are met
2. **Check HTTPS**: Ensure app is served over HTTPS
3. **Check manifest**: Verify manifest.json is valid
4. **Check service worker**: Verify service worker is registered
5. **Try different browser**: Test in different mobile browser

#### Problem: Native features not working
**Symptoms:**
- Camera not opening
- GPS not working
- Push notifications not received

**Solutions:**
1. **Check permissions**: Grant required permissions
2. **Check Capacitor plugins**: Verify plugins are properly configured
3. **Check device compatibility**: Verify device supports features
4. **Update Capacitor**: Ensure latest Capacitor version
5. **Rebuild app**: Rebuild native app with latest changes

## Debugging Tools

### Browser DevTools
- **Console**: Check for JavaScript errors
- **Network**: Monitor API calls and responses
- **Application**: Check localStorage, service worker, and cache
- **Performance**: Monitor app performance and bottlenecks

### Supabase Dashboard
- **Database**: Check table data and queries
- **Auth**: Monitor user authentication
- **Storage**: Check file uploads and permissions
- **Logs**: Review error logs and debugging info

### Mobile Debugging
- **Chrome DevTools**: Debug mobile app in browser
- **Safari Web Inspector**: Debug iOS app
- **Android Studio**: Debug Android app
- **Capacitor CLI**: Check plugin status and logs

## Error Codes Reference

### Authentication Errors
- `invalid_credentials`: Wrong email/password
- `email_not_confirmed`: Email needs verification
- `too_many_requests`: Rate limit exceeded
- `session_not_found`: Session expired or invalid

### Database Errors
- `permission_denied`: RLS policy violation
- `foreign_key_violation`: Referenced record not found
- `unique_violation`: Duplicate value in unique field
- `check_violation`: Data doesn't meet constraint

### Network Errors
- `network_error`: No internet connection
- `timeout`: Request timed out
- `server_error`: Server returned 5xx error
- `not_found`: Resource not found (404)

### Validation Errors
- `required_field`: Required field is missing
- `invalid_format`: Field format is invalid
- `too_long`: Field exceeds maximum length
- `too_short`: Field below minimum length

## Prevention Tips

### Regular Maintenance
- Keep dependencies updated
- Monitor error logs regularly
- Test on multiple devices
- Backup data regularly

### Code Quality
- Write comprehensive error handling
- Add proper logging
- Test edge cases
- Follow coding standards

### User Experience
- Provide clear error messages
- Add loading states
- Implement retry mechanisms
- Test offline scenarios

This troubleshooting guide helps developers quickly identify and resolve common issues in the Coopsama App, ensuring a smooth user experience and efficient development process.
