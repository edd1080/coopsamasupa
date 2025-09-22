# Coopsama App - Project Documentation

## Overview

This directory contains comprehensive documentation for the Coopsama App, a Progressive Web Application (PWA) designed for credit agents working with Guatemalan financial cooperatives. The documentation provides essential context for AI assistants and human developers working on this codebase.

## Documentation Structure

### Core Documentation
- **[product.md](./product.md)** - Business domain, requirements, and user experience
- **[tech.md](./tech.md)** - Technical architecture, patterns, and implementation details
- **[productstructure.md](./productstructure.md)** - Code organization, file structure, and development patterns

### Additional Resources
- **[development_guide.md](./development_guide.md)** - Development workflow, coding standards, and best practices
- **[api_reference.md](./api_reference.md)** - Complete API documentation for all interfaces and functions
- **[troubleshooting.md](./troubleshooting.md)** - Common issues, solutions, and debugging guide

## Quick Start

### For New Developers
1. Start with [product.md](./product.md) to understand the business context
2. Review [tech.md](./tech.md) to understand the technical architecture
3. Study [productstructure.md](./productstructure.md) to learn the code organization
4. Follow [development_guide.md](./development_guide.md) for development workflow

### For AI Assistants
1. Read [product.md](./product.md) for business domain understanding
2. Review [tech.md](./tech.md) for technical patterns and constraints
3. Use [productstructure.md](./productstructure.md) for code organization guidance
4. Reference [api_reference.md](./api_reference.md) for available interfaces

## Project Context

### Business Domain
- **Industry**: Guatemalan financial cooperatives
- **Users**: Credit agents, supervisors, back-office staff
- **Purpose**: Digital credit application management
- **Key Features**: Multi-step forms, document capture, offline support, prequalification engine

### Technical Stack
- **Frontend**: React 18.3.1 + TypeScript + Vite
- **UI**: Tailwind CSS + Radix UI + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Mobile**: Capacitor for native functionality
- **PWA**: Service workers + offline support

### Architecture Patterns
- **Feature-based components**: Organized by business domain
- **Custom hooks**: Business logic encapsulation
- **Context providers**: Global state management
- **Utility-first styling**: Tailwind CSS approach
- **Offline-first**: LocalForage + sync mechanisms

## Key Features

### Core Functionality
- **Multi-step Forms**: 6-section credit application process
- **Document Capture**: Native camera integration for DPI and photos
- **Offline Support**: Full functionality without internet connection
- **Prequalification**: Automated risk assessment engine
- **Real-time Sync**: Data synchronization across devices

### Technical Features
- **PWA**: Installable web app with native-like experience
- **Mobile-first**: Responsive design for all screen sizes
- **Security**: Row Level Security (RLS) and JWT authentication
- **Performance**: Code splitting, lazy loading, and caching
- **Accessibility**: Screen reader support and keyboard navigation

## Development Guidelines

### Code Standards
- **TypeScript**: Strict type checking enabled
- **React**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **Testing**: Unit and integration tests
- **Performance**: Bundle optimization and lazy loading

### File Organization
- **Components**: Feature-based directory structure
- **Hooks**: Custom hooks for business logic
- **Utils**: Utility functions by domain
- **Types**: TypeScript interfaces and types
- **Context**: React context providers

### Git Workflow
- **Feature branches**: Create branch for each feature
- **Pull requests**: Code review required
- **Commit messages**: Conventional commit format
- **Testing**: All changes must be tested
- **Documentation**: Update docs for significant changes

## Common Tasks

### Adding New Features
1. Create feature branch
2. Add components in appropriate directory
3. Create custom hooks for business logic
4. Add utility functions if needed
5. Update types and interfaces
6. Test thoroughly
7. Update documentation

### Debugging Issues
1. Check [troubleshooting.md](./troubleshooting.md) for common solutions
2. Use browser dev tools for debugging
3. Check Supabase dashboard for database issues
4. Review error logs and console output
5. Test on multiple devices and browsers

### Performance Optimization
1. Analyze bundle size and dependencies
2. Implement code splitting where appropriate
3. Optimize images and assets
4. Use React.memo for expensive components
5. Implement proper caching strategies

## Resources

### External Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)

### Internal Resources
- [API Reference](./api_reference.md) - Complete API documentation
- [Development Guide](./development_guide.md) - Development workflow
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions

## Contributing

### Before Making Changes
1. Read relevant documentation
2. Understand the business context
3. Follow established patterns
4. Test changes thoroughly
5. Update documentation as needed

### Code Review Checklist
- [ ] Code follows established patterns
- [ ] TypeScript types are properly defined
- [ ] Error handling is implemented
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met
- [ ] Documentation updated
- [ ] Tests added/updated

## Support

### For Developers
- Check [troubleshooting.md](./troubleshooting.md) for common issues
- Review [development_guide.md](./development_guide.md) for workflow guidance
- Use [api_reference.md](./api_reference.md) for interface documentation

### For AI Assistants
- Reference [product.md](./product.md) for business context
- Use [tech.md](./tech.md) for technical patterns
- Follow [productstructure.md](./productstructure.md) for code organization
- Check [api_reference.md](./api_reference.md) for available interfaces

---

This documentation is maintained alongside the codebase and should be updated whenever significant changes are made to the application architecture, business requirements, or development processes.
