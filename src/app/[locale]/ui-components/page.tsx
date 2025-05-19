// Components demo page to showcase all UI components in one place
'use client';

import React, { useState } from 'react';
import { 
  Button, 
  Input, 
  Card, 
  Badge, 
  Select, 
  Checkbox, 
  Textarea, 
  Alert,
  Modal,
  ModalActions,
  ConfirmModal
} from '@/components/ui';

export default function UIComponentsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">UI Components Library</h1>

      {/* Buttons Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <Card>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-3">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="text">Text</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Sizes</h3>
                <div className="flex flex-wrap gap-3 items-center">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">States</h3>
                <div className="flex flex-wrap gap-3">
                  <Button isLoading>Loading</Button>
                  <Button disabled>Disabled</Button>
                  <Button isFullWidth>Full Width</Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">With Icons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button leftIcon={<span>👈</span>}>Left Icon</Button>
                  <Button rightIcon={<span>👉</span>}>Right Icon</Button>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </section>

      {/* Inputs Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Inputs</h2>
        <Card>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Basic Input</h3>
                <Input
                  label="Username"
                  placeholder="Enter your username"
                  helperText="This is a helper text"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">With Error</h3>
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  error="Please enter a valid email address"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">With Icons</h3>
                <Input
                  label="Search"
                  placeholder="Search anything..."
                  leftIcon={<span>🔍</span>}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Variants</h3>
                <div className="space-y-4">
                  <Input
                    label="Outline (Default)"
                    placeholder="Outline variant"
                    variant="outline"
                  />
                  <Input
                    label="Filled"
                    placeholder="Filled variant"
                    variant="filled"
                  />
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </section>

      {/* Cards Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" hoverEffect>
            <Card.Header>
              <Card.Title>Elevated Card</Card.Title>
            </Card.Header>
            <Card.Body>
              <p>This is an elevated card with hover effect.</p>
            </Card.Body>
            <Card.Footer>
              <Button variant="text">Learn More</Button>
            </Card.Footer>
          </Card>

          <Card variant="outlined">
            <Card.Header>
              <Card.Title>Outlined Card</Card.Title>
            </Card.Header>
            <Card.Body>
              <p>This is an outlined card without hover effect.</p>
            </Card.Body>
            <Card.Footer>
              <Button variant="text">Learn More</Button>
            </Card.Footer>
          </Card>

          <Card variant="flat" clickable onClick={() => alert('Card clicked!')}>
            <Card.Header>
              <Card.Title>Flat Clickable Card</Card.Title>
            </Card.Header>
            <Card.Body>
              <p>This is a flat card that is clickable.</p>
            </Card.Body>
            <Card.Footer>
              <Button variant="text">Learn More</Button>
            </Card.Footer>
          </Card>
        </div>
      </section>

      {/* Badges Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Badges</h2>
        <Card>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Sizes</h3>
                <div className="flex flex-wrap gap-3 items-center">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Shapes</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge rounded={false}>Squared</Badge>
                  <Badge rounded>Rounded</Badge>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Usage Example</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="success" rounded>New</Badge>
                  <Badge variant="warning">In Progress</Badge>
                  <Badge variant="info" rounded>Updated</Badge>
                  <Badge variant="danger">Sold Out</Badge>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </section>

      {/* Select Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Select</h2>
        <Card>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Basic Select</h3>
                <Select
                  label="Country"
                  helperText="Select your country"
                  options={[
                    { value: '', label: 'Select a country', disabled: true },
                    { value: 'us', label: 'United States' },
                    { value: 'ca', label: 'Canada' },
                    { value: 'mx', label: 'Mexico' },
                    { value: 'uk', label: 'United Kingdom' },
                  ]}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">With Error</h3>
                <Select
                  label="Language"
                  error="Please select a language"
                  options={[
                    { value: '', label: 'Select a language' },
                    { value: 'en', label: 'English' },
                    { value: 'fr', label: 'French' },
                    { value: 'es', label: 'Spanish' },
                  ]}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">With Icon</h3>
                <Select
                  label="Category"
                  leftIcon={<span>📂</span>}
                  options={[
                    { value: '', label: 'Select a category' },
                    { value: 'tech', label: 'Technology' },
                    { value: 'health', label: 'Health & Fitness' },
                    { value: 'edu', label: 'Education' },
                  ]}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Sizes</h3>
                <div className="space-y-4">
                  <Select
                    label="Small"
                    size="sm"
                    options={[
                      { value: 'option1', label: 'Option 1' },
                      { value: 'option2', label: 'Option 2' },
                    ]}
                  />
                  <Select
                    label="Medium (Default)"
                    size="md"
                    options={[
                      { value: 'option1', label: 'Option 1' },
                      { value: 'option2', label: 'Option 2' },
                    ]}
                  />
                  <Select
                    label="Large"
                    size="lg"
                    options={[
                      { value: 'option1', label: 'Option 1' },
                      { value: 'option2', label: 'Option 2' },
                    ]}
                  />
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </section>

      {/* Checkbox Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Checkbox</h2>
        <Card>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Basic Checkbox</h3>
                <Checkbox
                  label="I agree to the terms and conditions"
                  helperText="Read our terms before agreeing"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">With Error</h3>
                <Checkbox
                  label="Accept privacy policy"
                  error="You must accept the privacy policy"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Sizes</h3>
                <div className="space-y-4">
                  <Checkbox
                    size="sm"
                    label="Small checkbox"
                  />
                  <Checkbox
                    size="md"
                    label="Medium checkbox (Default)"
                  />
                  <Checkbox
                    size="lg"
                    label="Large checkbox"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">States</h3>
                <div className="space-y-4">
                  <Checkbox
                    label="Default state"
                  />
                  <Checkbox
                    label="Checked state"
                    defaultChecked
                  />
                  <Checkbox
                    label="Disabled state"
                    disabled
                  />
                  <Checkbox
                    label="Disabled & checked state"
                    disabled
                    defaultChecked
                  />
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </section>

      {/* Textarea Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Textarea</h2>
        <Card>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Basic Textarea</h3>
                <Textarea
                  label="Message"
                  placeholder="Enter your message"
                  helperText="Your message will be sent to our support team"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">With Error</h3>
                <Textarea
                  label="Feedback"
                  placeholder="Enter your feedback"
                  error="Feedback must be at least 10 characters"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Variants</h3>
                <div className="space-y-4">
                  <Textarea
                    label="Outline (Default)"
                    placeholder="Outline variant"
                    variant="outline"
                  />
                  <Textarea
                    label="Filled"
                    placeholder="Filled variant"
                    variant="filled"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Custom Size</h3>
                <Textarea
                  label="Notes"
                  placeholder="Enter your notes"
                  rows={8}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </section>

      {/* Alerts Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Alerts</h2>
        <div className="space-y-4">
          <Alert variant="info" title="Information">
            This is an informational alert. Something you might want to know about.
          </Alert>
          
          <Alert variant="success" title="Success">
            Operation completed successfully! Everything worked as expected.
          </Alert>
          
          <Alert variant="warning" title="Warning" onClose={() => console.log('Alert closed')}>
            This action might have unexpected consequences. Proceed with caution.
          </Alert>
          
          <Alert variant="error" title="Error">
            An error occurred. Please try again or contact support if the issue persists.
          </Alert>
        </div>
      </section>

      {/* Modals Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Modals</h2>
        <Card>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Basic Modal</h3>
                <Button onClick={() => setIsModalOpen(true)}>
                  Open Modal
                </Button>
                
                <Modal 
                  isOpen={isModalOpen} 
                  onClose={() => setIsModalOpen(false)}
                  title="Modal Title"
                  footer={
                    <ModalActions>
                      <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsModalOpen(false)}>
                        Save Changes
                      </Button>
                    </ModalActions>
                  }
                >
                  <div className="py-4">
                    <p>This is a basic modal with a title and footer actions.</p>
                    <p className="mt-2">You can put any content here, including forms, text, and other components.</p>
                  </div>
                </Modal>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Confirm Modal</h3>
                <Button 
                  variant="danger" 
                  onClick={() => setIsConfirmModalOpen(true)}
                >
                  Delete Item
                </Button>
                
                <ConfirmModal
                  isOpen={isConfirmModalOpen}
                  onClose={() => setIsConfirmModalOpen(false)}
                  onConfirm={() => {
                    alert('Item deleted!');
                    setIsConfirmModalOpen(false);
                  }}
                  title="Confirm Deletion"
                  confirmText="Delete"
                  confirmVariant="danger"
                >
                  <p>Are you sure you want to delete this item? This action cannot be undone.</p>
                </ConfirmModal>
              </div>
            </div>
          </Card.Body>
        </Card>
      </section>
    </div>
  );
}
