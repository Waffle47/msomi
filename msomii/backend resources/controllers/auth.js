@@ .. @@
 export const login = async (req, res) => {
   const { email, password } = req.body;
   try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
       return res.status(400).json({ error: 'Email and password are required' });
     }

     const user = await User.findOne({ email }).select('+password');
     if (!user) {
       return res.status(400).json({ error: 'Invalid credentials' });
     }

     const isMatch = await user.comparePassword(password);
     if (!isMatch) {
       return res.status(400).json({ error: 'Invalid credentials' });
     }

+    // Update last login
+    user.lastLogin = new Date();
+    await user.save();
+
     const payload = { id: user._id, role: user.role };
     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
     console.log('Login - Generated JWT:', token);

     res.cookie('token', token, {
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production', // false for local
-      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'none', // Allow cross-origin
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000 // 1 hour
+      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
+      maxAge: 60 * 60 * 1000 // 1 hour
     });

     res.json({ 
       message: 'Login successful', 
       token, 
       user: { id: user._id, name: user.name, email: user.email, role: user.role } 
     });
   } catch (err) {
     console.error('Login Error:', err.message);
     res.status(500).json({ error: 'Server error: ' + err.message });
   }
 };