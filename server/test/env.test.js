describe('Retrieving Environment Variables', () => {
  it('should have MONGO_URI and PORT defined in environment variables', () => {
    expect(process.env.MONGO_URI).toBeDefined();
    expect(process.env.PORT).toBeDefined();
  });
});