-- Insert sample events
INSERT INTO events (title, date, description, image_url) VALUES
('Community Health Camp', '2024-01-15', 'Free health checkups and medical consultations for the community', '/placeholder.svg?height=300&width=400'),
('Tree Plantation Drive', '2024-01-22', 'Environmental initiative to plant 500 trees in Gudalur area', '/placeholder.svg?height=300&width=400'),
('Educational Scholarship Distribution', '2024-02-05', 'Annual scholarship ceremony for deserving students', '/placeholder.svg?height=300&width=400'),
('Blood Donation Camp', '2024-02-12', 'Life-saving blood donation drive in partnership with local hospitals', '/placeholder.svg?height=300&width=400'),
('Rotary Youth Leadership Awards', '2024-02-20', 'Recognizing outstanding young leaders in our community', '/placeholder.svg?height=300&width=400');

-- Insert board members
INSERT INTO board_members (name, position, year, image_url) VALUES
('Rtn. Rajesh Kumar', 'President', '2023-24', '/placeholder.svg?height=200&width=200'),
('Rtn. Priya Sharma', 'Vice President', '2023-24', '/placeholder.svg?height=200&width=200'),
('Rtn. Anil Gupta', 'Secretary', '2023-24', '/placeholder.svg?height=200&width=200'),
('Rtn. Meera Patel', 'Treasurer', '2023-24', '/placeholder.svg?height=200&width=200'),
('Rtn. Suresh Reddy', 'Club Service Director', '2023-24', '/placeholder.svg?height=200&width=200'),
('Rtn. Kavitha Nair', 'Community Service Director', '2023-24', '/placeholder.svg?height=200&width=200');

-- Insert gallery images
INSERT INTO gallery (image_url, caption) VALUES
('/placeholder.svg?height=300&width=400', 'Community Service Project'),
('/placeholder.svg?height=300&width=400', 'Weekly Club Meeting'),
('/placeholder.svg?height=300&width=400', 'Annual Charity Fundraiser'),
('/placeholder.svg?height=300&width=400', 'Youth Development Program'),
('/placeholder.svg?height=300&width=400', 'Environmental Initiative'),
('/placeholder.svg?height=300&width=400', 'International Partnership Project');

-- Insert about content
INSERT INTO about (welcome_title, about_text) VALUES
('Welcome to Rotary Club of Gudalur Garden City', 'The Rotary Club of Gudalur Garden City has been serving our community with dedication and passion since our charter. As part of Rotary International, we are committed to creating positive, lasting change in our community and around the world. Our club focuses on addressing challenges such as education, healthcare, environmental sustainability, and community development. Through our various service projects, fundraising initiatives, and partnerships, we strive to make a meaningful impact on the lives of those we serve. Join us in our mission to "Service Above Self" and be part of a global network of leaders who are passionate about making a difference.');
