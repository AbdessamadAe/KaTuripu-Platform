CREATE TABLE category(
category_id INTEGER PRIMARY KEY, 
category_name VARCHAR(40) NOT NULL,
category_description TEXT
);

CREATE TABLE topic(
	topic_id INTEGER PRIMARY KEY,
	category_id INTEGER REFERENCES category(category_id) ON DELETE CASCADE,
	topic_title VARCHAR(255) NOT NULL,
	topic_overview TEXT,
  	topic_content TEXT,
  	topic_image_url TEXT,
  	topic_additional_resources TEXT
);

INSERT INTO category VALUES
(1,'Calculus', 'The mathematical study of continuous change.'),
(2,'Algebra', 'The study of mathematical symbols and the rules for manipulating these symbols.'),
(3,'Geometry', 'The branch of mathematics concerned with the properties and relations of points, lines, surfaces, and solids.'),
(4,'Trigonometry', 'The study of relationships between side lengths and angles of triangles.');

INSERT INTO topic (category_id, topic_title, topic_overview, topic_content, topic_image_url, topic_additional_resources) VALUES
(1, 'Continuity', 'A fundamental aspect of calculus.', 'Content about the definition and importance of continuity in calculus.', 'image_url_of_continuity_graph', 'link_to_continuity_resources'),
(1, 'Limits', 'The concept of convergence in calculus.', 'Detailed explanation of limits and their applications.', 'image_url_of_limits', 'link_to_limits_resources'),
(2, 'Linear Equations', 'Equations involving linear functions.', 'In-depth discussion on solving linear equations.', 'image_url_of_linear_graph', 'link_to_linear_equations_resources'),
(3, 'Circles and Polygons', 'Properties of circles and polygons.', 'Exploring the properties and theorems related to circles and polygons.', 'image_url_of_shapes', 'link_to_geometry_resources'),
(4, 'Sine and Cosine', 'Trigonometric functions sine and cosine.', 'Exploring the sine and cosine functions and their uses in trigonometry.', 'image_url_of_wave', 'link_to_trigonometry_resources');
